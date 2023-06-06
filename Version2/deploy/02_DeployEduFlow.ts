import { ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { network } from "hardhat"
import { 
  MockUSDT, MockUSDT__factory,
  EducationPlatform, EducationPlatform__factory 
} from "../typechain-types";

const deployFunction: DeployFunction = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  let usdt
  if(network.name = 'hardhat'){
    usdt = await ethers.getContract("MockUSDT")
  } else{
    usdt = await ethers.getContractAt("MockUSDT", "0x76c89EC523F82e5457f681f8184cd2FFD895B8Cf")
  }
  const [ deployer ] = await ethers.getSigners()
  const constructorArgs = [usdt.address]
  
  console.log("[DEPLOYER] Deploy EDUflow...")

  const contract = await deploy("EducationPlatform", {
    from: deployer.address,
    args: constructorArgs,
    log: true
  })
  console.log("Deploy EDU executed")

  
}

export default deployFunction
deployFunction.tags = [`all`, `edu`]
/*async function main() {
  
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
*/