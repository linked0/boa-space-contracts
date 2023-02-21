import { NonceManager } from "@ethersproject/experimental";
import { create } from "domain";
import { Wallet } from "ethers";
import { ethers } from "hardhat";
import { GasPriceManager } from "../../utils/GasPriceManager";
import { GravatarRegistry } from "../../typechain-types";
import { expect } from "chai";

async function main() {
  const GravatarFactory = await ethers.getContractFactory("GravatarRegistry");
  const provider = ethers.provider;

  const admin = new Wallet(process.env.FINPL_NFT_CREATOR_KEY || "");
  const adminSigner = new NonceManager(new GasPriceManager(provider.getSigner(admin.address)));

  const gravatar = await GravatarFactory.connect(adminSigner).deploy();
  await gravatar.deployed();

  console.log(`Lock with 1 ETH deployed to ${gravatar.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
