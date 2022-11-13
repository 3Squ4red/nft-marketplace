# NFT Marketplace
Here, you'd find heart-warming creatures who are available for adoption. Check them out, adopt them or bettery yet, create one of your own!

## Features
1. Clean UI
2. Create and upload your very own cuties!
3. List them for further adoption (they may get a little sad about this)
4. You can view and download any of the creatures, **BUT** that won't take away their authenticity
5. Get directly paid when someone buys your NFT

## Demo 🚀
Visit [here](https://nft-marketplace-bytecode-velocity.vercel.app/) and view the contract [here](https://goerli.etherscan.io/address/0x51cf26d73578bce0699aebdd9f3a2d4997ba6144)

## Tech Stack
I used [Next.js](https://nextjs.org/) and **Typescript** for building the frontend website.

For contract compilation/deployment/testing and contract interaction, I've used Hardhat and ethers.js respectively. And since this dApp runs on ***Görli***, one the PoS testnet for Ethereum, it's contract is written in Solidity, using some of the industry standard contracts provided by [OpenZepplin](https://www.openzeppelin.com/).

## Limitations
While I've tested the contract using chai matchers and mocha framework in Hardhat to make sure it behaves as expected, there is still one major flaw that I think exists in the smart contract.
All the NFTs are stored in an array and the their `tokenID` are considered the same as the index at which they're stored at. So, if someone directly calls the `burn` function of it's parent contract, it might not get reflected in the array. This can cause mismatch between NFT's `tokenID`.
However, this can be avoided until someone burns a token.

## What I learned
- How to programmatically upload to IPFS
- Writing Hardhat test for ERC721
- Signing messages using Metamask
- Using React-Toastify to display messages to the user
- Deploying web apps on Vercel for free
