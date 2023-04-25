import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const INFURA_API_KEY = ""
const SEPOLIA_PRIVATE_KEY = ""
const mumbai_API_URL =''
const mumbai_PRIVATE_KEY=""


module.exports = {
  solidity: "0.8.17",
  networks: {
    BNBtestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      gasPrice: 20000000000,
      accounts: {mnemonic: "12 words"}
    },
    polygon_mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [process.env.PRIVATE_KEY]
    },
    etherscan: {
      apiKey: process.env.POLYGONSCAN_API_KEY
    },
  }
};