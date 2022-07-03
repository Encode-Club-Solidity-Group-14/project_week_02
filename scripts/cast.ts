import { Contract, ethers } from "ethers";
import "dotenv/config";
import * as customBallotJson from "../artifacts/contracts/CustomBallot.sol/CustomBallot.json";
import * as tokenJson from "../artifacts/contracts/Token.sol/MyToken.json";
import { CustomBallot, MyToken } from "../typechain";
import { initWallet1 } from "./utils/initWallet";

async function main() {
  const signer = await initWallet1();

  //Index 0 = Path of script, Index 1 = File being executed, Index 2 = Ballot Address, Index 3 Token Address, Index 4 = Proposal Index passed in,
  if (process.argv.length < 3) {
    throw new Error("Custom Ballot address missing");
  }
  //Index 2 = Ballot Address
  const customBallotAddress = process.argv[2];

  //check for parameters Token Address
  if (process.argv.length < 4) {
    throw new Error("Token address missing");
  }

  //Index 3 = MyToken Address
  const myTokenAddress = process.argv[3];

  //Index 4 = Proposal index passed in, is length is less than 5 then no proposal index is passed in
  if (process.argv.length < 5) {
    throw new Error("Proposal index missing");
  }
  //Index 3 = Proposal index passed in
  const proposalIndex = process.argv[4];

  //Display ballot address
  console.log(
    `Attaching custom ballot contract interface to address ${customBallotAddress}`
  );

  //Obtaining abi from ballot.json
  const customBallotContract: CustomBallot = new Contract(
    customBallotAddress,
    customBallotJson.abi,
    signer
  ) as CustomBallot;

  // Display MyToken Address
  console.log(
    `Attaching MyToken contract interface to address ${myTokenAddress}`
  );

  //Obtaining abi from MyToken.json
  const myTokenContract: MyToken = new Contract(
    myTokenAddress,
    tokenJson.abi,
    signer
  ) as MyToken;

  //Set proposal as proposal index defined in queryProposal function in ballotContract
  const proposal = await customBallotContract.queryProposal(proposalIndex);
  //Display proposal index

  console.log("Proposal chosen: " + ethers.utils.parseBytes32String(proposal));
  //Cast vote by calling vote function passing in proposal index in ballot contract
  const votesAmount = await myTokenContract.getVotes(signer.address);

  const tx = await customBallotContract.vote(proposalIndex, votesAmount);

  console.log("Awaiting confirmations");

  await tx.wait();
  //Display tx hash
  console.log(`Transaction completed. Hash: ${tx.hash}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
