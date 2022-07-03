import { Contract, ethers } from "ethers";
import "dotenv/config";
import * as customBallotJson from "../artifacts/contracts/CustomBallot.sol/CustomBallot.json";
import { CustomBallot } from "../typechain";
import { initWallet } from './utils/initWallet';

//Create wallet object
async function main() {
  const signer = await initWallet();
  //Index 0 = Path of script, Index 1 = File being executed, Index 2 = Ballot Address, Index 3 = Proposal Index passed in,
  if (process.argv.length < 3) {
    throw new Error("Ballot address missing");
  }
  //Index 2 = Ballot Address
  const customBallotAddress = process.argv[2];
  // Display Ballot Address
  console.log(
    `Attaching ballot contract interface to address ${customBallotAddress}`
  );
  //Obtaining abi from ballot.json
  const customBallotContract: CustomBallot = new Contract(
    customBallotAddress,
    customBallotJson.abi,
    signer
  ) as CustomBallot;
  //Index 3 = Proposal Index
  if (process.argv.length < 4) {
    throw new Error("Ballot proposal index missing");
  }
  //Store proposals in proposalToQuery
  const proposalToQuery = process.argv[3];
  //Call function queryProposal inputting propocalToQuery paramenter in ballot Contract
  const proposal = await customBallotContract.queryProposal(proposalToQuery)
  //Display proposal name converting bytecode to string proposal name
  console.log("Proposal found: " + ethers.utils.parseBytes32String(proposal));

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});