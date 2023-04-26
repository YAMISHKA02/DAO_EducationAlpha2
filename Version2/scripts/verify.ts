import { ethers } from "hardhat";
import "@nomiclabs/hardhat-etherscan";
const hre = require("hardhat");

async function main() {
// Verify the contract after deploying
await hre.run("verify:verify", {
address: "0xECd73EC899E2958e206d201B13f4b1E09707469F", // of contract
constructorArguments: [], // token address
});

}
// Call the main function and catch if there is any error
main()
.then(() => process.exit(0))
.catch((error) => {
console.error(error);
process.exit(1);
});