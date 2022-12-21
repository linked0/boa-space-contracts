import { NonceManager } from "@ethersproject/experimental";
import { create } from "domain";
import { Wallet } from "ethers";
import { ethers } from "hardhat";
import { GasPriceManager } from "../utils/GasPriceManager";

async function main() {
    const ConduitCreatorFactory = await ethers.getContractFactory("ConduitCreator");

    const provider = ethers.provider;
    const admin = new Wallet(process.env.ADMIN_KEY || "");
    const adminSigner = new NonceManager(new GasPriceManager(provider.getSigner(admin.address)));

    const conduitCreator = await ConduitCreatorFactory.attach(process.env.CONDUIT_CREATOR_ADDRESS || "");
    const creatorAddress = await conduitCreator.connect(adminSigner).getConduitCreator();
    console.log("admin address: ", admin.address);
    console.log("creatorAddress: ", creatorAddress);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
