// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

// Uncomment this line to use console.log
// import "../node_modules/hardhat/console.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFTMarket is ERC721URIStorage {
    constructor() ERC721("Cuties", "KYUT") {}
}
