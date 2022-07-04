[![CircleCI](https://dl.circleci.com/status-badge/img/gh/Encode-Club-Solidity-Group-14/project_week_02/tree/main.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/Encode-Club-Solidity-Group-14/project_week_02/tree/main)
[![codecov](https://codecov.io/gh/Encode-Club-Solidity-Group-14/project_week_02/branch/main/graph/badge.svg?token=ZISTHFFZFW)](https://codecov.io/gh/Encode-Club-Solidity-Group-14/project_week_02)

# Weekend project 2 - Group 15

- Form groups of 3 to 5 students
- Complete the contracts together
- Structure scripts to
  - Deploy everything
  - Interact with the ballot factory
  - Query proposals for each ballot
  - Operate scripts
- Publish the project in Github
- Run the scripts with a few set of proposals, play around with token balances, cast and delegate votes, create ballots from snapshots, interact with the ballots and inspect results
- Write a report detailing the addresses, transaction hashes, description of the operation script being executed and console output from script execution for each step
- (Extra) Use TDD methodology

**Getting Started**

Before everything, clone the project:

```
git clone https://github.com/Encode-Club-Solidity-Group-14/project_week_02.git
```

**Building**

```
yarn install
```

```
yarn hardhat compile
```

**Tests**

```
yarn hardhat test
```

**Coverage check**

```
npx hardhat coverage
```

# Scritps Usage

**Deploy Everything**

Script: ``deploy.ts {list_of_proposals}``

```
yarn ts-node --files .\scripts\deploy.ts Proposal_1 Proposal_2 Proposal_3
```

![Deploy](./docs/images/deploy.JPG)

**Result:**

- Token Contract deployed at [0x90E0d7a007dCf9438a38F7aa14F18E24853134B6](https://ropsten.etherscan.io/address/0x90E0d7a007dCf9438a38F7aa14F18E24853134B6)

- Custom Ballot Contract deployed at [0xdfa071311CF8A04a6b32431cCcD6551573Ac58Ca](https://ropsten.etherscan.io/address/0xdfa071311CF8A04a6b32431cCcD6551573Ac58Ca)

**Query Proposals**

Script: ``query_proposal.ts {custom_ballot_address} {proposal_index_to_query}``

```
yarn ts-node --files .\scripts\query_proposal.ts 0xdfa071311CF8A04a6b32431cCcD6551573Ac58Ca 0
```

![Query](./docs/images/queryProposal.JPG)

**Mint**

Script: ``mint.ts {token_address} {address_to_receive_minted_tokens} {amount_to_mint}``

```
yarn ts-node --files .\scripts\mint.ts 0x90E0d7a007dCf9438a38F7aa14F18E24853134B6 0x47fd5f1600721D53d64F7B161FF79152C31408CE 10
```

![Mint](./docs/images/mint.JPG)

- Minted transaction execution [0x4294169060af0529c9a56efae3f5ebbcdbdf904cd738909c7c1fc6bbef4db8e8](https://ropsten.etherscan.io/tx/0x4294169060af0529c9a56efae3f5ebbcdbdf904cd738909c7c1fc6bbef4db8e8)

![Minted](./docs/images/minted.JPG)

**Delegate**

Script: ``delegate.ts {token_address} {address_to_delegate} ``

```
yarn ts-node --files .\scripts\delegate.ts 0x90E0d7a007dCf9438a38F7aa14F18E24853134B6 0xfb542204Ed21212258a8DD6288C96676970382B7
```

![Delegate](./docs/images/delegate.JPG)

- Delegate transaction execution [0x1981d2bb97867b6fb7ce8e1695c69b71c00d42ae802f06d3d521a066a67904f4](https://ropsten.etherscan.io/tx/0x1981d2bb97867b6fb7ce8e1695c69b71c00d42ae802f06d3d521a066a67904f4)

**Cast**

Script: ``delegate.ts {custom_ballot_address} {token_address} {proposal_index} ``

```
yarn ts-node --files .\scripts\cast.ts 0xdfa071311CF8A04a6b32431cCcD6551573Ac58Ca 0x90E0d7a007dCf9438a38F7aa14F18E24853134B6 0
```

![Cast](./docs/images/cast.JPG)

- Cast transaction execution [0xbbc2b1a3ad8d074d024e6b179bf798e5b607577b5389dd0355c74da9e4a36f9c](https://ropsten.etherscan.io/tx/0xbbc2b1a3ad8d074d024e6b179bf798e5b607577b5389dd0355c74da9e4a36f9c)

**Query results**

Script: ``delegate.ts {custom_ballot_address}``

```
yarn ts-node --files .\scripts\query_results.ts 0xdfa071311CF8A04a6b32431cCcD6551573Ac58Ca
```

![Results](./docs/images/query_results.JPG)

**Create Ballot from Snapshots**

Script: ``create_ballot_from_snapshot.ts {token_address} {list_of_proposals}``

```
yarn ts-node --files .\scripts\create_ballot_from_snapshot.ts 0x90E0d7a007dCf9438a38F7aa14F18E24853134B6 New_Proposal_1 New_Proposal_2 New_Proposal_3
```

![ballot_from_snapshot](./docs/images/ballot_from_snapshot.JPG)

- Custom Ballot Contract deployed at [0x424832D0609DB848F70318a0747718b6B16dBb7f](https://ropsten.etherscan.io/address/0x424832D0609DB848F70318a0747718b6B16dBb7f)