import { ethers } from "hardhat";
import * as customBallotJson from "../artifacts/contracts/CustomBallot.sol/CustomBallot.json";
import * as tokenJson from "../artifacts/contracts/Token.sol/MyToken.json";
import { initWallet } from './utils/initWallet';

const EXPOSED_KEY = "NOT_USED";

//Convert Strings to Bytes32 to save gas fee
function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
  }
  return bytes32Array;
}

async function main() {
  const signer = await initWallet();
  const balanceBN = await signer.getBalance();
  const balance = Number(ethers.utils.formatEther(balanceBN));
  console.log(`Wallet balance ${balance}`);

  //Throw error if connected wallet has under 0.01 ETH
  if (balance < 0.01) {
    throw new Error("Not enough ether");
  }

  console.log("Deploying Ballot contract");
  console.log("Proposals: ");

  const proposals = process.argv.slice(2);

  //If length is under 2 no proposal is provided
  if (proposals.length < 2) {
    throw new Error("Not enough proposals provided");
  }

  //For each proposal display proposal name and index position
  proposals.forEach((element, index) => {
    console.log(`Proposal N. ${index + 1}: ${element}`);
  });


  //Deploy contract to blockchain
  const tokenFactory = new ethers.ContractFactory(
    tokenJson.abi, 
    tokenJson.bytecode,
    signer
  );


  const tokenContract = await tokenFactory.deploy();

  console.log("Awaiting confirmations");
  //Contract deployed
  await tokenContract.deployed();

  //Deploy contract to blockchain obtaining abi and bytecode from ballot.json
  const customBallotFactory = new ethers.ContractFactory(
    customBallotJson.abi,
    customBallotJson.bytecode,
    signer
  );

  //Create contract instance and pass proposals parameter in
  const customBallotContract = await customBallotFactory.deploy(
    convertStringArrayToBytes32(proposals),
    tokenContract.address
  );

  console.log("Awaiting confirmations");
  //Contract deployed
  await customBallotContract.deployed();

  console.log("Completed");
  console.log(`Token Contract deployed at ${tokenContract.address}`);
  console.log(`Custom Ballot Contract deployed at ${customBallotContract.address}`);
  
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
