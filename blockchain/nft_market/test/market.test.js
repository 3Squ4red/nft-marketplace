const { expect } = require("chai");

describe("NFTMarket", () => {
  let nftmarket;
  let accounts;
  const nftPrice = ethers.utils.parseEther("0.3").toString();
  const listingPrice = ethers.utils.parseEther("0.025").toString();

  // Deploying contract
  before(async () => {
    const NFTMarket = await ethers.getContractFactory("NFTMarket");
    nftmarket = await NFTMarket.deploy();
    await nftmarket.deployed();
    accounts = await ethers.getSigners();
  });

  // Testing mint and conditions around it
  describe("Mint NFT", () => {
    const uri = "https://www.google.com";
    // Minting an NFT first
    before(async () => {
      await nftmarket
        .connect(accounts[0])
        .mintToken(uri, nftPrice, { value: listingPrice });
    });

    it("owner of the token 0 must be accounts[0]", async () => {
      expect(await nftmarket.ownerOf(0)).to.equal(accounts[0].address);
    });

    it("should set the correct tokenURI of token 0", async () => {
      expect(await nftmarket.tokenURI(0)).to.equal(uri);
    });

    it("should not allow token creation with duplicate URI", async () => {
      await expect(nftmarket.mintToken(uri, nftPrice)).to.revertedWith(
        "URI already exists"
      );
    });

    it("should have one listed item", async () => {
      expect(await nftmarket.getListedItemsCount()).to.equal(1);
    });

    it("should create an NFT item for token 0", async () => {
      const [price, creator, isListed] = await nftmarket.getNFTItemAt(0);

      expect(price).to.equal(nftPrice);
      expect(creator).to.equal(accounts[0].address);
      expect(isListed).to.equal(true);
    });
  });

  // Testing buying NFT
  describe("Buy NFT", () => {
    let listedItemsCount;
    // Buying an NFT first
    before(async () => {
      listedItemsCount = await nftmarket.getListedItemsCount();
      expect(listedItemsCount).to.be.equal(1);
      await nftmarket.connect(accounts[1]).buyNFT(0, { value: nftPrice });
    });

    it("should unlist the NFT of id 0", async () => {
      const nftItem = await nftmarket.getNFTItemAt(0);
      expect(nftItem.isListed).to.be.equal(false);
    });

    it("should decrease the no. of NFTs listed by 1", async () => {
      expect(await nftmarket.getListedItemsCount()).to.equal(
        listedItemsCount - 1
      );
    });

    it("accounts[1] should be the new owner", async () => {
      expect(await nftmarket.ownerOf(0)).to.equal(accounts[1].address);
    });
  });

  // Testing NFT transfers
  describe("NFT Transfers", () => {
    const uri = "https://test-json-2.com";
    before(async () => {
      await nftmarket
        .connect(accounts[1])
        .mintToken(uri, nftPrice, { value: listingPrice });
    });

    it("total supply should be 2", async () => {
      expect(await nftmarket.totalSupply()).to.be.equal(2);
    });

    it("should retreive NFT by index", async () => {
      const nft0 = await nftmarket.getNFTItemAt(0);
      const nft1 = await nftmarket.getNFTItemAt(1);

      expect(nft0.creator).to.be.equal(accounts[0].address);
      expect(nft1.creator).to.be.equal(accounts[1].address);
    });
  });
});
