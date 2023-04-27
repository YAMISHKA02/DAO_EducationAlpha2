import { ethers, network, run } from "hardhat";
import "@nomiclabs/hardhat-etherscan";
const hre = require("hardhat");


export const verify = async (contractAddress: string, args: any[]) => {
    console.log("Verifying contract...")
    if(args.length){
        try {
            await run("verify:verify", {
                address: contractAddress,
                constructorArguments: args,
            })
        } catch (e: any) {
            if (e.message.toLowerCase().includes("already verified")) {
                console.log("Already verified!")
            } else {
                console.log(e)
            }
        }
    } else{
        try {
            await run("verify:verify", {
                address: contractAddress,
                constructorArguments: args,
                contract: 'contracts/MockUSDT.sol:MockUSDT'
            })
        } catch (e: any) {
            if (e.message.toLowerCase().includes("already verified")) {
                console.log("Already verified!")
            } else {
                console.log(e)
            }
        }
    }
    
}