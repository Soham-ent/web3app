const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyNFT", function () {
  it("Should mint and transfer an NFT to someone", async function () {
    const PokemonClub = await ethers.getContractFactory("PokemonClub");
    const pokemonclub = await PokemonClub.deploy();
    await pokemonclub.deployed();

    const recipient = "0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199";
    const metadataURI = "cid/test.png";

    let balance = await pokemonclub.balanceOf(recipient);
    expect(balance).to.equal(0);

    const newlyMintedToken = await pokemonclub.payToMint(
      recipient,
      metadataURI,
      {
        value: ethers.utils.parseEther("0.05"),
      }
    );

    // wait until the transaction is minted
    await newlyMintedToken.wait();

    balance = await pokemonclub.balanceOf(recipient);
    expect(balance).to.equal(1);

    expect(await pokemonclub.isContentOwned(metadataURI)).to.equal(true);
    // const newlyMintedToken2 = await pokemonclub.payToMint(recipient, 'foo', { value: ethers.utils.parseEther('0.05') });
  });
});
