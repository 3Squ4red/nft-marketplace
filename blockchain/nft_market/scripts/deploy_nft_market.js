async function main() {
  const _NFTMarket = await ethers.getContractFactory("NFTMarket");
  const NFTMarket = await _NFTMarket.deploy();

  await NFTMarket.deployed();

  console.log(`NFTMarket deployed to ${NFTMarket.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
