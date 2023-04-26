import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
import dotenv from 'dotenv';
dotenv.config();



const PRIVATE_KEY = process.env.PRIVATE_KEY;
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY;

module.exports = {
  solidity: "0.8.17",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      hardfork: "merge",
      // If you want to do some forking set `enabled` to true
      forking: {
          url: "",
          blockNumber: Number(""),
          enabled: false,
      },
      chainId: 31337,
    },
    localhost: {
      chainId: 31337,
    },
    BNBtestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      gasPrice: 20000000000,
      accounts: {mnemonic: "12 words"}
    },
    //polygon_mumbai: {
      //url: "https://rpc-mumbai.maticvigil.com",
      //accounts: [""]
    //},
  },
  etherscan: {
    url: "https://api.polygonscan.com/api",
    apiKey: ""
  }
};