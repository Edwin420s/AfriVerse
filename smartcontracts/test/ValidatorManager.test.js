const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ValidatorManager", function () {
  let ValidatorManager;
  let validatorManager;
  let owner, user1, user2, user3;

  beforeEach(async function () {
    [owner, user1, user2, user3] = await ethers.getSigners();

    ValidatorManager = await ethers.getContractFactory("ValidatorManager");
    validatorManager = await ValidatorManager.deploy();
    await validatorManager.deployed();

    // Grant admin role to owner
    const ADMIN_ROLE = await validatorManager.ADMIN_ROLE();
    await validatorManager.grantRole(ADMIN_ROLE, owner.address);
  });

  describe("Deployment", function () {
    it("Should set the right initial validation threshold", async function () {
      expect(await validatorManager.getValidationThreshold()).to.equal(3);
    });

    it("Should set the right initial validator stake", async function () {
      expect(await validatorManager.validatorStake()).to.equal(ethers.utils.parseEther("0.01"));
    });

    it("Should grant deployer the admin role", async function () {
      expect(await validatorManager.isAdmin(owner.address)).to.be.true;
    });
  });

  describe("Validator Application", function () {
    it("Should allow users to become validators with stake", async function () {
      const validatorStake = await validatorManager.validatorStake();
      
      await expect(
        validatorManager.connect(user1).applyAsValidator({ value: validatorStake })
      ).to.emit(validatorManager, "ValidatorAdded");

      expect(await validatorManager.isValidator(user1.address)).to.be.true;
      
      const validatorInfo = await validatorManager.getValidatorInfo(user1.address);
      expect(validatorInfo.stake).to.equal(validatorStake);
      expect(validatorInfo.reputation).to.equal(100);
      expect(validatorInfo.isActive).to.be.true;
    });

    it("Should prevent becoming validator with insufficient stake", async function () {
      const validatorStake = await validatorManager.validatorStake();
      const insufficientStake = validatorStake.div(2);
      
      await expect(
        validatorManager.connect(user1).applyAsValidator({ value: insufficientStake })
      ).to.be.revertedWith("Insufficient stake");
    });

    it("Should prevent duplicate validator applications", async function () {
      const validatorStake = await validatorManager.validatorStake();
      
      await validatorManager.connect(user1).applyAsValidator({ value: validatorStake });
      
      await expect(
        validatorManager.connect(user1).applyAsValidator({ value: validatorStake })
      ).to.be.revertedWith("Already a validator");
    });

    it("Should track validator count correctly", async function () {
      const validatorStake = await validatorManager.validatorStake();
      
      expect(await validatorManager.getValidatorCount()).to.equal(0);
      
      await validatorManager.connect(user1).applyAsValidator({ value: validatorStake });
      expect(await validatorManager.getValidatorCount()).to.equal(1);
      
      await validatorManager.connect(user2).applyAsValidator({ value: validatorStake });
      expect(await validatorManager.getValidatorCount()).to.equal(2);
    });
  });

  describe("Validator Management", function () {
    beforeEach(async function () {
      const validatorStake = await validatorManager.validatorStake();
      await validatorManager.connect(user1).applyAsValidator({ value: validatorStake });
      await validatorManager.connect(user2).applyAsValidator({ value: validatorStake });
    });

    it("Should allow admin to remove validators", async function () {
      await expect(
        validatorManager.connect(owner).removeValidator(user1.address)
      ).to.emit(validatorManager, "ValidatorRemoved");

      expect(await validatorManager.isValidator(user1.address)).to.be.false;
    });

    it("Should return stake when validator is removed", async function () {
      const initialBalance = await ethers.provider.getBalance(user1.address);
      
      await validatorManager.connect(owner).removeValidator(user1.address);
      
      const finalBalance = await ethers.provider.getBalance(user1.address);
      // Balance should increase by approximately the stake amount (minus gas)
      expect(finalBalance.gt(initialBalance)).to.be.true;
    });

    it("Should prevent non-admin from removing validators", async function () {
      await expect(
        validatorManager.connect(user2).removeValidator(user1.address)
      ).to.be.revertedWith(/AccessControl:/);
    });

    it("Should return all validators", async function () {
      const validators = await validatorManager.getAllValidators();
      
      expect(validators).to.have.lengthOf(2);
      expect(validators).to.include(user1.address);
      expect(validators).to.include(user2.address);
    });
  });

  describe("Reputation System", function () {
    beforeEach(async function () {
      const validatorStake = await validatorManager.validatorStake();
      await validatorManager.connect(user1).applyAsValidator({ value: validatorStake });
    });

    it("Should allow admin to update validator reputation", async function () {
      await validatorManager.connect(owner).updateValidatorReputation(user1.address, true);
      
      let validatorInfo = await validatorManager.getValidatorInfo(user1.address);
      expect(validatorInfo.validationCount).to.equal(1);
      expect(validatorInfo.correctValidations).to.equal(1);
      expect(validatorInfo.reputation).to.equal(100);

      await validatorManager.connect(owner).updateValidatorReputation(user1.address, false);
      
      validatorInfo = await validatorManager.getValidatorInfo(user1.address);
      expect(validatorInfo.validationCount).to.equal(2);
      expect(validatorInfo.correctValidations).to.equal(1);
      expect(validatorInfo.reputation).to.equal(50);
    });

    it("Should prevent non-admin from updating reputation", async function () {
      await expect(
        validatorManager.connect(user2).updateValidatorReputation(user1.address, true)
      ).to.be.revertedWith(/AccessControl:/);
    });
  });

  describe("Configuration", function () {
    it("Should allow admin to update validation threshold", async function () {
      await expect(
        validatorManager.connect(owner).setValidationThreshold(5)
      ).to.emit(validatorManager, "ValidationThresholdUpdated");

      expect(await validatorManager.getValidationThreshold()).to.equal(5);
    });

    it("Should allow admin to update validator stake", async function () {
      const newStake = ethers.utils.parseEther("0.02");
      
      await expect(
        validatorManager.connect(owner).setValidatorStake(newStake)
      ).to.emit(validatorManager, "ValidatorStakeUpdated");

      expect(await validatorManager.validatorStake()).to.equal(newStake);
    });

    it("Should prevent invalid threshold settings", async function () {
      await expect(
        validatorManager.connect(owner).setValidationThreshold(0)
      ).to.be.revertedWith("Threshold must be positive");
    });

    it("Should prevent non-admin from updating configuration", async function () {
      await expect(
        validatorManager.connect(user1).setValidationThreshold(5)
      ).to.be.revertedWith(/AccessControl:/);
    });
  });

  describe("Access Control", function () {
    it("Should correctly identify admins", async function () {
      expect(await validatorManager.isAdmin(owner.address)).to.be.true;
      expect(await validatorManager.isAdmin(user1.address)).to.be.false;
    });

    it("Should correctly identify validators", async function () {
      const validatorStake = await validatorManager.validatorStake();
      
      expect(await validatorManager.isValidator(user1.address)).to.be.false;
      
      await validatorManager.connect(user1).applyAsValidator({ value: validatorStake });
      expect(await validatorManager.isValidator(user1.address)).to.be.true;
    });
  });
});