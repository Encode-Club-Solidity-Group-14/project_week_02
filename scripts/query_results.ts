import { Contract, ethers } from "ethers";
import "dotenv/config";
import * as customBallotJson from "../artifacts/contracts/CustomBallot.sol/CustomBallot.json";
import * as tokenJson from "../artifacts/contracts/Token.sol/MyToken.json";
import { CustomBallot, MyToken } from "../typechain";
import { initWallet1 } from "./utils/initWallet";

async function main() {
  const signer = await initWallet1();

  //Index 0 = Path of script, Index 1 = File being executed, Index 2 = Ballot Address, Index 3 = Proposal Index passed in,
  if (process.argv.length < 3) {
    throw new Error("Custom Ballot address missing");
  }
  //Index 2 = Ballot Address
  const customBallotAddress = process.argv[2];

  //Obtaining abi from ballot.json
  const customBallotContract: CustomBallot = new Contract(
    customBallotAddress,
    customBallotJson.abi,
    signer
  ) as CustomBallot;

  console.log(
    `Attaching custom ballot contract interface to address ${customBallotAddress}`
  );

 //Call winnerName in ballot contract
 const winningProposal = await customBallotContract.winnerName();
 //Convert bytes32 to string and display winning proposal
 console.log("Winning proposal is: " + ethers.utils.parseBytes32String(winningProposal));

}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
