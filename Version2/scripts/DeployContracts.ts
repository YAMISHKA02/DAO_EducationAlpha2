import { ethers, deployments } from "hardhat";
import { 
  MockUSDT, MockUSDT__factory,
  EducationPlatform, EducationPlatform__factory 
} from "../typechain-types";
import { DeployFunction,  } from "hardhat-deploy/dist/types";
import { verify } from "./verify";


async function main() {
  
  const [deployer] = await ethers.getSigners()

  console.log("Deploing with that account:", deployer.address)
  console.log("Account balance:", (await deployer.getBalance()).toString());
  
  await deployments.fixture(['usdt', 'edu'])
  const usdt = await ethers.getContract("MockUSDT")
  const edu = await ethers.getContract("EducationPlatform")
  
  console.log(`USDT contract was developed with address: ${usdt.address}`);
  console.log(`EDU contract was developed with address: ${edu.address}`);

  await verify(usdt.address,[])
  await verify(edu.address, [usdt.address])
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
