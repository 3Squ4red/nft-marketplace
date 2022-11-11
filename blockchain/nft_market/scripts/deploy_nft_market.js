async function main() {
  const _NFTMarket = await ethers.getContractFactory("NFTMarket");
  const NFTMarket = await _NFTMarket.deploy();

  await NFTMarket.deployed();

  NFTMarket.mintToken(
    "https://gateway.pinata.cloud/ipfs/QmWMyXSs3QbsXkfC18p5CjEfv5RVT6QBd5DHz4U92QiEDs",
    "500000000000000000",
    { value: "250000000000000", gasLimit: 1199999 }
  );

  console.log(`NFTMarket deployed to ${NFTMarket.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
