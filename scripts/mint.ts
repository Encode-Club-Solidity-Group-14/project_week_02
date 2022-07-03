import { Contract, ethers } from "ethers";
import "dotenv/config";
import * as customBallotJson from "../artifacts/contracts/CustomBallot.sol/CustomBallot.json";
import * as tokenJson from "../artifacts/contracts/Token.sol/MyToken.json";
import { CustomBallot, MyToken } from "../typechain";
import { initWallet1 } from "./utils/initWallet";

async function main() {
  const signer = await initWallet1();

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

  //check for parameters Address to receive minted tokens
  if (process.argv.length < 4) {
    throw new Error("Creditor address missing");
  }

  //Index 3 = Address to receive minted tokens
  const addressToReceiveMintedTokens = process.argv[3];

  //check for parameters Amount to Mint
  if (process.argv.length < 5) {
    throw new Error("Amount to Mint missing");
  }

  //Index 4 = Amount to mint
  const amountToMint = process.argv[4];

  //Obtaining abi from MyToken.json
  const myTokenContract: MyToken = new Contract(
    myTokenAddress,
    tokenJson.abi,
    signer
  ) as MyToken;

  const txMint = await myTokenContract.mint(addressToReceiveMintedTokens, ethers.utils.parseEther(amountToMint))

  await txMint.wait();

  console.log("Minted... ");
  

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
