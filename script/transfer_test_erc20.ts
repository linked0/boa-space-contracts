import { NonceManager } from "@ethersproject/experimental";
import { BigNumber, Wallet } from "ethers";
import { ethers } from "hardhat";
import { randomBN, toBN } from "../test/utils/encoding";
import { GasPriceManager } from "../utils/GasPriceManager";

async function main() {
    const TestERC20Factory = await ethers.getContractFactory("TestERC20");
    const erc20Contract = await TestERC20Factory.attach(process.env.TEST_ERC20_ADDRESS || "");

    const provider = ethers.provider;
    const creator = new Wallet(process.env.FINPL_NFT_CREATOR_KEY || "");
    const creatorSigner = new NonceManager(new GasPriceManager(provider.getSigner(creator.address)));
    const buyer = new Wallet(process.env.ORDER_NFT_BUYER_KEY || "");
    const buyerSigner = new NonceManager(new GasPriceManager(provider.getSigner(buyer.address)));
    
    const creatorContract = await erc20Contract.connect(creatorSigner);

    // mint first NFT token of TestERC20
    await creatorContract.transferFrom(creator.address, buyer.address, BigNumber.from("10000"));
    console.log("TestERC20 Token transferred");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
