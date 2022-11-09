// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

// Uncomment this line to use console.log
// import "../node_modules/hardhat/console.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";

contract NFTMarket is ERC721URIStorage {
    struct NFTItem {
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
    // *NOTE* The index at which an NFT will be stored in this array will be it's `tokenID`
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
        NFTItems.push(NFTItem(price, msg.sender, true));

        emit NFTCreated(newTokenId, price, msg.sender, true);

        tokenIds.increment();
        listedItems.increment();
        URIexists[tokenURI] = true;

        return newTokenId;
    }

    function buyNFT(uint tokenID) external payable {
        // Get the price and the owner of this NFT
        uint price = NFTItems[tokenID].price;
        address previousOwner = ERC721.ownerOf(tokenID);

        // Check the amount sent and the owner
        require(msg.sender != previousOwner, "You already own this NFT");
        require(msg.value == price, "Insufficient purchase amount");

        // Delist the NFT from the market
        NFTItems[tokenID].isListed = false;
        listedItems.decrement();

        // Finally transfer the ownership of the NFT to msg.sender
        // and pay the previous owner
        _transfer(previousOwner, msg.sender, tokenID);
        payable(previousOwner).transfer(msg.value);
    }

    // Will be used to access an individual NFT Item
    function getNFTItemAt(uint tokenID) external view returns (NFTItem memory) {
        require(tokenID < NFTItems.length, "index out of bounds");
        return NFTItems[tokenID];
    }

    // Returns the total no. of NFTs created/minted so far
    function totalSupply() external view returns (uint) {
        return NFTItems.length;
    }

    function getListedItemsCount() external view returns (uint) {
        return listedItems.current();
    }
}
