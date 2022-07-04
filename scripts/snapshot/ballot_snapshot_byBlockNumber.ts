import { Contract, ethers } from "ethers";
import "dotenv/config";
import * as customBallotJson from "../../artifacts/contracts/CustomBallot.sol/CustomBallot.json";
import * as tokenJson from "../../artifacts/contracts/Token.sol/MyToken.json";
import { CustomBallot, MyToken } from "../../typechain";
import { initWallet1, initWallet2, initWallet3 } from "../utils/initWallet";

const BASE_VOTE_POWER = 10;

async function main() {
  const signer1 = await initWallet1();
  const signer2 = await initWallet2();
  const signer3 = await initWallet3();

  //check for parameters Custom Ballot Address
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

  //Display ballot address
  console.log(
    `Attaching custom ballot contract interface to address ${customBallotAddress}`
  );

  //Obtaining abi from ballot.json
  const customBallotContract: CustomBallot = new Contract(
    customBallotAddress,
    customBallotJson.abi
  ) as CustomBallot;

  // Display MyToken Address
  console.log(
    `Attaching MyToken contract interface to address ${myTokenAddress}`
  );

  //Obtaining abi from MyToken.json
  const myTokenContract: MyToken = new Contract(
    myTokenAddress,
    tokenJson.abi
  ) as MyToken;

  await printBalance(myTokenContract, signer1, signer2, signer3);

  console.log("Get Votes... ");

  const votes1 = await myTokenContract.connect(signer1).getVotes(signer1.address);
  const votes2 = await myTokenContract.connect(signer2).getVotes(signer2.address);
  const votes3 = await myTokenContract.connect(signer3).getVotes(signer3.address);


  console.log(`Votes:`)
  console.log(`signer1: ${votes1}`)
  console.log(`signer2: ${votes2}`)
  console.log(`signer3: ${votes3}`)


  const pastVotes1 = await myTokenContract.connect(signer1).getPastVotes(signer1.address, 12518473);
  const pastVotes2 = await myTokenContract.connect(signer2).getPastVotes(signer2.address, 12518473);
  const pastVotes3 = await myTokenContract.connect(signer3).getPastVotes(signer3.address, 12518473);
  
  console.log(`Past Votes:`)
  console.log(`signer1: ${pastVotes1}`)
  console.log(`signer2: ${pastVotes2}`)
  console.log(`signer3: ${pastVotes3}`)


  const pastVotes1_block1 = await myTokenContract.connect(signer1).getPastVotes(signer1.address, 1);
  const pastVotes2_block1 = await myTokenContract.connect(signer2).getPastVotes(signer2.address, 1);
  const pastVotes3_block1 = await myTokenContract.connect(signer3).getPastVotes(signer3.address, 1);
  
  console.log(`Past Votes from block 1:`)
  console.log(`signer1: ${pastVotes1_block1}`)
  console.log(`signer2: ${pastVotes2_block1}`)
  console.log(`signer3: ${pastVotes3_block1}`)


}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


async function printBalance(myTokenContract: MyToken, signer1: ethers.Wallet, signer2: ethers.Wallet, signer3: ethers.Wallet) {
    const signer1BalanceOfMyToken = await myTokenContract.connect(signer1).balanceOf(signer1.address);
    console.log(
        `signer1: ${signer1.address} Balance myToken: ${signer1BalanceOfMyToken}`
    );
    const signer2BalanceOfMyToken = await myTokenContract.connect(signer2).balanceOf(signer2.address);
    console.log(
        `signer2: ${signer2.address} Balance myToken: ${signer2BalanceOfMyToken}`
    );
    const signer3BalanceOfMyToken = await myTokenContract.connect(signer3).balanceOf(signer3.address);
    console.log(
        `signer3: ${signer3.address} Balance myToken: ${signer3BalanceOfMyToken}`
    );
}

