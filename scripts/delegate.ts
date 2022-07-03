import { Contract, ethers } from "ethers";
import "dotenv/config";
import * as customBallotJson from "../artifacts/contracts/CustomBallot.sol/CustomBallot.json";
import * as tokenJson from "../artifacts/contracts/Token.sol/MyToken.json";
import { CustomBallot, MyToken } from "../typechain";
import { initWallet2 } from "./utils/initWallet";

async function main() {
  const signer = await initWallet2();

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

  //check for parameters Address to delegate
  if (process.argv.length < 4) {
    throw new Error("Delegator address missing");
  }

  //Index 3 = Address to delegate
  const addressToDelegate = process.argv[3];

  //Obtaining abi from MyToken.json
  const myTokenContract: MyToken = new Contract(
    myTokenAddress,
    tokenJson.abi,
    signer
  ) as MyToken;

  const delegateTx = await myTokenContract.delegate(addressToDelegate);
  await delegateTx.wait();
  console.log("Delegated... ");
  const votes = ethers.utils.formatEther(
    await myTokenContract.getVotes(addressToDelegate)
  );
  console.log(`Address: ${addressToDelegate} Votes: ${votes}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
