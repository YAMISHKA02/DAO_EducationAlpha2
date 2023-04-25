import { ethers } from "hardhat";
import "@nomiclabs/hardhat-etherscan";
const hre = require("hardhat");

async function main() {

// Verify the contract after deploying
await hre.run("verify:verify", {
address: "0x2B006A0f580B4b87B4c09630114545277AdF847F", // of contract
constructorArguments: ["0xE097d6B3100777DC31B34dC2c58fB524C2e76921"], // token address
});
}
// Call the main function and catch if there is any error
main()
.then(() => process.exit(0))
.catch((error) => {
console.error(error);
process.exit(1);
});