// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

// Uncomment this line to use console.log
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFTMarket is ERC721URIStorage {
    struct NFTItem {
        uint tokenID;
        uint price;
        address creator;
        bool isListed;
    }
    event NFTCreated(uint id, uint price, address creator, bool isListed);

    using Counters for Counters.Counter;

    Counters.Counter private listedItems;
    Counters.Counter private tokenIds;
    // This is the price that every minter should pay for minting an NFT
    uint public constant LISTING_PRICE = 0.025 ether;
    // Will be used to prevent NFT creation with same URIs
    mapping(string => bool) private URIexists;
    // Will be used to store all the NFTs
    NFTItem[] private NFTItems;

    constructor() ERC721("Cuties", "KYUT") {}

    modifier validateMinting(string calldata URI, uint price) {
        require(!URIexists[URI], "URI already exists");
        require(price > 0, "NFT price cannot be 0");
        require(
            msg.value == LISTING_PRICE,
            "amount sent must be equal to listing price"
        );
        _;
    }

    function mintToken(string calldata tokenURI, uint price)
        external
        payable
        validateMinting(tokenURI, price)
        returns (uint)
    {
        uint newTokenId = tokenIds.current();

        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        // A newly minted NFT will also be immediately listed
        NFTItems.push(NFTItem(newTokenId, price, msg.sender, true));

        emit NFTCreated(newTokenId, price, msg.sender, true);

        tokenIds.increment();
        listedItems.increment();
        URIexists[tokenURI] = true;

        return newTokenId;
    }

    function buyNFT(uint tokenID) external payable {
        NFTItem storage nft = NFTItems[tokenID];

        uint price = nft.price;
        address previousOwner = ERC721.ownerOf(nft.tokenID);
        bool isListed = nft.isListed;

        // Check the owner
        require(msg.sender != previousOwner, "You already own this NFT");
        // Revert if this NFT is not listed
        require(isListed, "can't purchase unlisted NFT");
        // Check the sent amount
        require(msg.value == price, "Insufficient purchase amount");

        // Delist the NFT from the market
        nft.isListed = false;
        listedItems.decrement();

        // Finally transfer the ownership of the NFT to msg.sender
        // and pay the previous owner
        _transfer(previousOwner, msg.sender, tokenID);
        payable(previousOwner).transfer(msg.value);
    }

    function placeNFTOnSale(uint tokenID, uint price) public payable {
        require(ERC721.ownerOf(tokenID) == msg.sender, "caller is not owner");
        require(msg.value == LISTING_PRICE, "must send listing price");

        NFTItem storage nft = NFTItems[tokenID];

        require(!nft.isListed, "already listed for sale");

        nft.isListed = true;
        nft.price = price;
        listedItems.increment();
    }

    function getAllNFTsOnSale() external view returns (NFTItem[] memory) {
        uint ts = totalSupply();
        NFTItem[] memory onSale = new NFTItem[](listedItems.current());
        uint index = 0;

        for (uint i = 0; i < ts; i++) {
            NFTItem memory nft = NFTItems[i];
            if (nft.isListed) onSale[index++] = nft;
        }

        return onSale;
    }

    function getAllNFTs() external view returns (NFTItem[] memory) {
        return NFTItems;
    }

    // Returns an array of all the NFTs owned by msg.sender
    function getMyNFTs() external view returns (NFTItem[] memory) {
        uint myNFTsCount = ERC721.balanceOf(msg.sender); // No. of NFTs owned by msg.sender
        NFTItem[] memory myNFTs = new NFTItem[](myNFTsCount);
        uint index = 0;

        for (uint i = 0; i < NFTItems.length; i++) {
            NFTItem memory nft = NFTItems[i];
            if (ERC721.ownerOf(nft.tokenID) == msg.sender)
                myNFTs[index++] = NFTItems[i];
        }

        return myNFTs;
    }

    // Will be used to access an individual NFT Item
    function getNFTItem(uint tokenID)
        external
        view
        returns (NFTItem memory nft)
    {
        return NFTItems[tokenID];
    }

    // Returns the total no. of NFTs created/minted so far
    function totalSupply() public view returns (uint) {
        return NFTItems.length;
    }

    function getListedItemsCount() external view returns (uint) {
        return listedItems.current();
    }
}
