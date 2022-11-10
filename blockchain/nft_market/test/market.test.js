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
      const [tokenID, price, creator, isListed] = await nftmarket.getNFTItem(0);

      expect(tokenID).to.equal(0);
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

    it("should not buy an unlisted NFT", async () => {
      await expect(
        nftmarket.connect(accounts[2]).buyNFT(0, { value: nftPrice })
      ).to.be.revertedWith("can't purchase unlisted NFT");
    });

    it("should unlist the NFT of id 0", async () => {
      const nftItem = await nftmarket.getNFTItem(0);
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
        .connect(accounts[0])
        .mintToken(uri, nftPrice, { value: listingPrice });
    });

    it("total supply should be 2", async () => {
      expect(await nftmarket.totalSupply()).to.be.equal(2);
    });

    it("should retreive NFT by index", async () => {
      await nftmarket.getNFTItem(0);
      await nftmarket.getNFTItem(1);
    });

    it("should have listed one NFT only", async () => {
      const nftsOnSale = await nftmarket.getAllNFTsOnSale();

      expect(nftsOnSale[0].tokenID).to.be.equal(1);
      expect(nftsOnSale.length).to.be.equal(1);
    });

    it("account[0] should have owned one NFT only", async () => {
      const acc0NFTs = await nftmarket.connect(accounts[0]).getMyNFTs();

      expect(acc0NFTs.length).to.be.equal(1);
      expect(acc0NFTs[0].tokenID).to.be.equal(1);
    });

    it("account[1] should have owned one NFT only", async () => {
      const acc1NFTs = await nftmarket.connect(accounts[1]).getMyNFTs();

      expect(acc1NFTs.length).to.be.equal(1);
      expect(acc1NFTs[0].tokenID).to.be.equal(0);
    });
  });

  describe("Token transfer to new owner", () => {
    before(async () => {
      await nftmarket.transferFrom(accounts[0].address, accounts[1].address, 1);
    });

    it("accounts[0] should have 0 tokens", async () => {
      const acc0NFTs = await nftmarket.connect(accounts[0]).getMyNFTs();
      expect(acc0NFTs.length).to.be.equal(0);
    });

    it("accounts[1] should have 2 tokens", async () => {
      const acc1NFTs = await nftmarket.connect(accounts[1]).getMyNFTs();
      expect(acc1NFTs.length).to.be.equal(2);
    });
  });

  describe("List an NFT", () => {
    before(async () => {
      await nftmarket
        .connect(accounts[1])
        .placeNFTOnSale(0, 500, { value: listingPrice });
    });

    it("should have two listed items", async () => {
      expect(await nftmarket.getListedItemsCount()).to.equal(2);
    });

    it("should not allow anyone else other than owner to change the listing price", async () => {
      await expect(
        nftmarket.connect(accounts[1]).setListingPrice(10)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should set new listing price", async () => {
      await nftmarket.setListingPrice(10);
      expect(await nftmarket.LISTING_PRICE()).to.equal(10);
    });
  });
});
