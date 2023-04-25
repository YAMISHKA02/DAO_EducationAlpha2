import { ethers } from "hardhat";
import { 
  MockUSDT, MockUSDT__factory,
  EducationPlatform, EducationPlatform__factory 
} from "../typechain-types";

async function main() {
  const tokenAddress ="0xE097d6B3100777DC31B34dC2c58fB524C2e76921"
  const [deployer] = await ethers.getSigners()

  console.log("Deploing with that account:", deployer.address)
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const EDU  = await ethers.getContractFactory("EducationPlatform")
  const edu  = await EDU.deploy(tokenAddress)

  await edu.deployed();

  console.log(`EDU contract was developed with address: ${edu.address}`);
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
