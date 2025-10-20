const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CulturalToken", function () {
  let CulturalToken;
  let culturalToken;
  let owner, minter, burner, user1, user2;

  beforeEach(async function () {
    [owner, minter, burner, user1, user2] = await ethers.getSigners();

    CulturalToken = await ethers.getContractFactory("CulturalToken");
    culturalToken = await CulturalToken.deploy();
    await culturalToken.deployed();

    // Grant roles
    const MINTER_ROLE = await culturalToken.MINTER_ROLE();
    const BURNER_ROLE = await culturalToken.BURNER_ROLE();

    await culturalToken.grantRole(MINTER_ROLE, minter.address);
    await culturalToken.grantRole(BURNER_ROLE, burner.address);
  });

  describe("Deployment", function () {
    it("Should set the right name and symbol", async function () {
      expect(await culturalToken.name()).to.equal("AfriVerse Cultural Token");
      expect(await culturalToken.symbol()).to.equal("AFRIC");
    });

    it("Should grant deployer the default admin role", async function () {
      const DEFAULT_ADMIN_ROLE = await culturalToken.DEFAULT_ADMIN_ROLE();
      expect(await culturalToken.hasRole(DEFAULT_ADMIN_ROLE, owner.address)).to.be.true;
    });
  });

  describe("Token Minting", function () {
    it("Should allow minter to mint tokens", async function () {
      await expect(
        culturalToken.connect(minter).mintCulturalTokens(user1.address, 100)
      ).to.emit(culturalToken, "CulturalTokensMinted");

      expect(await culturalToken.balanceOf(user1.address)).to.equal(100);
      expect(await culturalToken.getCulturalScore(user1.address)).to.equal(100);
    });

    it("Should update cultural score on minting", async function () {
      await culturalToken.connect(minter).mintCulturalTokens(user1.address, 50);
      await culturalToken.connect(minter).mintCulturalTokens(user1.address, 25);

      expect(await culturalToken.getCulturalScore(user1.address)).to.equal(75);
    });

    it("Should prevent non-minters from minting", async function () {
      await expect(
        culturalToken.connect(user1).mintCulturalTokens(user2.address, 100)
      ).to.be.revertedWith(/AccessControl:/);
    });
  });

  describe("Token Burning", function () {
    beforeEach(async function () {
      // Mint some tokens first
      await culturalToken.connect(minter).mintCulturalTokens(user1.address, 100);
    });

    it("Should allow burner to burn tokens", async function () {
      await expect(
        culturalToken.connect(burner).burnCulturalTokens(user1.address, 30)
      ).to.emit(culturalToken, "CulturalTokensBurned");

      expect(await culturalToken.balanceOf(user1.address)).to.equal(70);
      expect(await culturalToken.getCulturalScore(user1.address)).to.equal(70);
    });

    it("Should update cultural score on burning", async function () {
      await culturalToken.connect(burner).burnCulturalTokens(user1.address, 40);
      expect(await culturalToken.getCulturalScore(user1.address)).to.equal(60);
    });

    it("Should prevent burning more than balance", async function () {
      await expect(
        culturalToken.connect(burner).burnCulturalTokens(user1.address, 150)
      ).to.be.revertedWith("ERC20: burn amount exceeds balance");
    });

    it("Should prevent non-burners from burning", async function () {
      await expect(
        culturalToken.connect(user1).burnCulturalTokens(user2.address, 50)
      ).to.be.revertedWith(/AccessControl:/);
    });
  });

  describe("Non-Transferable Feature", function () {
    beforeEach(async function () {
      await culturalToken.connect(minter).mintCulturalTokens(user1.address, 100);
    });

    it("Should prevent token transfers", async function () {
      await expect(
        culturalToken.connect(user1).transfer(user2.address, 50)
      ).to.be.revertedWith("Cultural tokens are non-transferable");
    });

    it("Should prevent token transferFrom", async function () {
      await expect(
        culturalToken.connect(user1).transferFrom(user1.address, user2.address, 50)
      ).to.be.revertedWith("Cultural tokens are non-transferable");
    });
  });

  describe("Cultural Score Checks", function () {
    beforeEach(async function () {
      await culturalToken.connect(minter).mintCulturalTokens(user1.address, 75);
    });

    it("Should return correct cultural score", async function () {
      expect(await culturalToken.getCulturalScore(user1.address)).to.equal(75);
    });

    it("Should check minimum score correctly", async function () {
      expect(await culturalToken.hasMinimumScore(user1.address, 50)).to.be.true;
      expect(await culturalToken.hasMinimumScore(user1.address, 100)).to.be.false;
      expect(await culturalToken.hasMinimumScore(user2.address, 10)).to.be.false;
    });
  });

  describe("Role Management", function () {
    it("Should allow admin to grant roles", async function () {
      const MINTER_ROLE = await culturalToken.MINTER_ROLE();
      
      await culturalToken.grantRole(MINTER_ROLE, user1.address);
      expect(await culturalToken.hasRole(MINTER_ROLE, user1.address)).to.be.true;
    });

    it("Should allow admin to revoke roles", async function () {
      const MINTER_ROLE = await culturalToken.MINTER_ROLE();
      
      await culturalToken.grantRole(MINTER_ROLE, user1.address);
      await culturalToken.revokeRole(MINTER_ROLE, user1.address);
      
      expect(await culturalToken.hasRole(MINTER_ROLE, user1.address)).to.be.false;
    });
  });
});