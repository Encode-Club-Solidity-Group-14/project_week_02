import { Contract, ethers } from "ethers";
import "dotenv/config";
import * as customBallotJson from "../artifacts/contracts/CustomBallot.sol/CustomBallot.json";
import * as tokenJson from "../artifacts/contracts/Token.sol/MyToken.json";
import { CustomBallot, MyToken } from "../typechain";
import { initWallet1, initWallet2, initWallet3 } from "./utils/initWallet";

//Convert Strings to Bytes32 to save gas fee
function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
  }
  return bytes32Array;
}

async function main() {
  const signer1 = await initWallet1();
  const signer2 = await initWallet2();
  const signer3 = await initWallet3();

  //check for parameters Token Address
  if (process.argv.length < 3) {
    throw new Error("Token address missing");
  }

  //Index 2 = MyToken Address
  const myTokenAddress = process.argv[2];

  // Display MyToken Address
  console.log(
    `Attaching MyToken contract interface to address ${myTokenAddress}`
  );

  //Obtaining abi from MyToken.json
  const myTokenContract: MyToken = new Contract(
    myTokenAddress,
    tokenJson.abi
  ) as MyToken;

  //Obtaining abi and bytecode from ballot.json
  const customBallotFactory = new ethers.ContractFactory(
    customBallotJson.abi,
    customBallotJson.bytecode,
    signer1
  );

  const proposals = process.argv.slice(3);

  //If length is under 2 no proposal is provided
  if (proposals.length < 2) {
    throw new Error("Not enough proposals provided");
  }

  //For each proposal display proposal name and index position
  proposals.forEach((element, index) => {
    console.log(`Proposal N. ${index + 1}: ${element}`);
  });

  //Create contract instance and pass proposals parameter in
  const customBallotContract = await customBallotFactory.deploy(
    convertStringArrayToBytes32(proposals),
    myTokenContract.address
  );

  console.log("Awaiting confirmations");
  //Contract deployed
  await customBallotContract.deployed();
  
  console.log("##########");
  console.log("Completed");
  console.log(`Custom Ballot Contract deployed at ${customBallotContract.address}`);
  console.log("##########");
  console.log("Checking by Voting Power - From snapshot");

      
  const votesSigner1 = await myTokenContract.connect(signer1).getVotes(signer1.address);
  console.log(`Voter 1: ${customBallotContract.address} votes: ${votesSigner1} voting...`)
  customBallotContract.connect(signer1).vote(0, votesSigner1)
  
  const votesSigner2 = await myTokenContract.connect(signer2).getVotes(signer2.address);
  console.log(`Voter 2: ${customBallotContract.address} votes: ${votesSigner2} voting...`)
  customBallotContract.connect(signer2).vote(0, votesSigner2)

  const votesSigner3 = await myTokenContract.connect(signer3).getVotes(signer3.address);
  console.log(`Voter 3: ${customBallotContract.address} votes: ${votesSigner3} voting...`)
  customBallotContract.connect(signer3).vote(1, votesSigner3)
  console.log("########")
  console.log("Getting winner...")
  const winner = await customBallotContract.connect(signer1).winnerName()
  const winnerName = ethers.utils.parseBytes32String(winner);
  console.log("########")
  console.log(`Winner name is: ${winnerName}`)
  
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
