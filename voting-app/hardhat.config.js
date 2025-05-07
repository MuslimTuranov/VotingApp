/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require('dotenv').config();
require("@nomicfoundation/hardhat-toolbox");

const { SEPOLIA_RPC_URL, SEPOLIA_PRIVATE_KEY } = process.env;

module.exports = {
  solidity: "0.8.24",
  defaultNetwork: "sepolia",
  networks: {
    hardhat: {},
    sepolia: {  
      url: SEPOLIA_RPC_URL,
      accounts: [SEPOLIA_PRIVATE_KEY], 
      gas: 2100000,  
      gasPrice: 8000000000,  
    }
  },
};