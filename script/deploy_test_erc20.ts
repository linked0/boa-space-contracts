import { NonceManager } from "@ethersproject/experimental";
import { BigNumber, Wallet } from "ethers";
import { ethers } from "hardhat";
import { randomBN, toBN } from "../test/utils/encoding";
import { GasPriceManager } from "../utils/GasPriceManager";

async function main() {
    const TestERC20Factory = await ethers.getContractFactory("TestERC20");

    const provider = ethers.provider;
    const creator = new Wallet(process.env.FINPL_NFT_CREATOR_KEY || "");
    const creatorSigner = new NonceManager(new GasPriceManager(provider.getSigner(creator.address)));
    const tokenId = BigNumber.from(process.env.TEST_ERC721_TOKEN_ID || "0");

    const buyer = new Wallet(process.env.ORDER_NFT_BUYER_KEY || "");
    const buyerSigner = new NonceManager(new GasPriceManager(provider.getSigner(buyer.address)));
    
    // deploy TestERC20 contract
    const token = await TestERC20Factory.connect(creatorSigner).deploy();
    await token.deployed();
    console.log("TestERC20 deployed - to:", token.address);
    
    // mint first NFT token of TestERC20
    await token.mint(creator.address, BigNumber.from("100000000000000000000"));
    console.log("TestERC20 Token minted");

    await token.mint(buyer.address, BigNumber.from("100000000000000000000"));
    console.log("TestERC20 Token minted");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
