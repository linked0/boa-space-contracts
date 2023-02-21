import { NonceManager } from "@ethersproject/experimental";
import { create } from "domain";
import { Wallet } from "ethers";
import { ethers } from "hardhat";
import { GasPriceManager } from "../../utils/GasPriceManager";
import { GravatarRegistry } from "../../typechain-types";
import { expect } from "chai";

async function main() {
  const GravatarRegistryFactory = await ethers.getContractFactory("GravatarRegistry");

  const provider = ethers.provider;
  const user = new Wallet(process.env.BUYER_KEY || "");
  const userSigner = new NonceManager(new GasPriceManager(provider.getSigner(user.address)));

  const gravatar = await GravatarRegistryFactory.attach(process.env.GRAVATAR_CONTRACT || "");
  const name = "jung";
  const url = "https://en.wikipedia.org/wiki/Image#/media/File:Pencil_drawing_of_a_girl_in_ecstasy.jpg";
  await gravatar.connect(userSigner).createGravatar(name, url);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
})