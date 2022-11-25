require("@nomicfoundation/hardhat-toolbox");
const keys = require("../../keys.json");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 100000,
      },
    },
  },
  networks: {
    goerli: {
      url: keys.INFURA_GOERLI_URL,
      accounts: [`0x${keys.PRIVATE_KEY}`],
    },
  },
};
