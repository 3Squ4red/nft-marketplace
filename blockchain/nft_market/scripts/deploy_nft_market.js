async function main() {
  const _NFTMarket = await ethers.getContractFactory("NFTMarket");
  const NFTMarket = await _NFTMarket.deploy();

  await NFTMarket.deployed();

  const accounts = await ethers.getSigners();

  NFTMarket.mintToken(
    "https://gateway.pinata.cloud/ipfs/QmWMyXSs3QbsXkfC18p5CjEfv5RVT6QBd5DHz4U92QiEDs",
    "500000000000000000",
    { value: "25000000000000000"}
  );

  NFTMarket.mintToken(
    "https://gateway.pinata.cloud/ipfs/QmTevS6y9HHzZAgkmY24gDrZamJj6sygzGYbknBY3fPtt9",
    "300000000000000000",
    { value: "25000000000000000"}
  );

  console.log(`NFTMarket deployed to ${NFTMarket.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
