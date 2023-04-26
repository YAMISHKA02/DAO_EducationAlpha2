import { ethers } from "hardhat";
import { 
  MockUSDT, MockUSDT__factory,
  EducationPlatform, EducationPlatform__factory 
} from "../typechain-types";

async function main() {
  
  const [deployer] = await ethers.getSigners()

  console.log("Deploing with that account:", deployer.address)
  console.log("Account balance:", (await deployer.getBalance()).toString());
  
  const USDT = await ethers.getContractFactory("MockUSDT")
  const usdt = await USDT.deploy()
  await usdt.deployed()

  const argument = usdt.address
  const EDU  = await ethers.getContractFactory("EducationPlatform")
  const edu  = await EDU.deploy(argument)
  await edu.deployed();
  console.log(`USDT contract was developed with address: ${usdt.address}`);
  console.log(`EDU contract was developed with address: ${edu.address}`);
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
