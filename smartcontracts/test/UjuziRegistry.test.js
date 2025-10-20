const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("UjuziRegistry", function () {
  let UjuziRegistry, CulturalToken, ValidatorManager;
  let ujuziRegistry, culturalToken, validatorManager;
  let owner, validator1, validator2, contributor1, contributor2;

  const sampleCID = ethers.utils.formatBytes32String("QmSampleCID123456789");
  const sampleLanguage = "Swahili";
  const sampleCommunity = "Kikuyu";
  const sampleAtomHashes = [
    ethers.utils.formatBytes32String("atom1"),
    ethers.utils.formatBytes32String("atom2")
  ];

  beforeEach(async function () {
    [owner, validator1, validator2, contributor1, contributor2] = await ethers.getSigners();

    // Deploy ValidatorManager
    ValidatorManager = await ethers.getContractFactory("ValidatorManager");
    validatorManager = await ValidatorManager.deploy();
    await validatorManager.deployed();

    // Deploy CulturalToken
    CulturalToken = await ethers.getContractFactory("CulturalToken");
    culturalToken = await CulturalToken.deploy();
    await culturalToken.deployed();

    // Deploy UjuziRegistry
    UjuziRegistry = await ethers.getContractFactory("UjuziRegistry");
    ujuziRegistry = await UjuziRegistry.deploy(
      validatorManager.address,
      culturalToken.address
    );
    await ujuziRegistry.deployed();

    // Setup roles
    const MINTER_ROLE = await culturalToken.MINTER_ROLE();
    const BURNER_ROLE = await culturalToken.BURNER_ROLE();
    const ADMIN_ROLE = await validatorManager.ADMIN_ROLE();

    await culturalToken.grantRole(MINTER_ROLE, ujuziRegistry.address);
    await culturalToken.grantRole(BURNER_ROLE, ujuziRegistry.address);
    await validatorManager.grantRole(ADMIN_ROLE, owner.address);

    // Setup validators
    const validatorStake = await validatorManager.validatorStake();
    await validatorManager.connect(validator1).applyAsValidator({ value: validatorStake });
    await validatorManager.connect(validator2).applyAsValidator({ value: validatorStake });
  });

  describe("Deployment", function () {
    it("Should set the right validator manager", async function () {
      expect(await ujuziRegistry.validatorManager()).to.equal(validatorManager.address);
    });

    it("Should set the right cultural token", async function () {
      expect(await ujuziRegistry.culturalToken()).to.equal(culturalToken.address);
    });

    it("Should have zero initial entries", async function () {
      expect(await ujuziRegistry.getTotalEntries()).to.equal(0);
    });
  });

  describe("Entry Submission", function () {
    it("Should allow submission of new cultural entries", async function () {
      await expect(
        ujuziRegistry.connect(contributor1).submitEntry(
          sampleCID,
          1, // LicenseType.CC_BY_NC
          sampleLanguage,
          sampleCommunity,
          sampleAtomHashes
        )
      ).to.emit(ujuziRegistry, "EntrySubmitted");

      const totalEntries = await ujuziRegistry.getTotalEntries();
      expect(totalEntries).to.equal(1);

      const entry = await ujuziRegistry.getEntry(0);
      expect(entry.cid).to.equal(sampleCID);
      expect(entry.author).to.equal(contributor1.address);
      expect(entry.language).to.equal(sampleLanguage);
      expect(entry.community).to.equal(sampleCommunity);
      expect(entry.status).to.equal(0); // EntryStatus.Pending
    });

    it("Should mint cultural tokens on submission", async function () {
      await ujuziRegistry.connect(contributor1).submitEntry(
        sampleCID,
        1,
        sampleLanguage,
        sampleCommunity,
        sampleAtomHashes
      );

      const culturalScore = await culturalToken.getCulturalScore(contributor1.address);
      expect(culturalScore).to.equal(10); // Initial mint amount
    });

    it("Should prevent duplicate CID submission", async function () {
      await ujuziRegistry.connect(contributor1).submitEntry(
        sampleCID,
        1,
        sampleLanguage,
        sampleCommunity,
        sampleAtomHashes
      );

      await expect(
        ujuziRegistry.connect(contributor2).submitEntry(
          sampleCID,
          1,
          sampleLanguage,
          sampleCommunity,
          sampleAtomHashes
        )
      ).to.be.revertedWith("CID already exists");
    });

    it("Should track author entries correctly", async function () {
      await ujuziRegistry.connect(contributor1).submitEntry(
        sampleCID,
        1,
        sampleLanguage,
        sampleCommunity,
        sampleAtomHashes
      );

      const authorEntries = await ujuziRegistry.getAuthorEntries(contributor1.address);
      expect(authorEntries.length).to.equal(1);
      expect(authorEntries[0]).to.equal(0);
    });
  });

  describe("Entry Validation", function () {
    beforeEach(async function () {
      // Submit an entry first
      await ujuziRegistry.connect(contributor1).submitEntry(
        sampleCID,
        1,
        sampleLanguage,
        sampleCommunity,
        sampleAtomHashes
      );
    });

    it("Should allow validators to validate entries", async function () {
      await expect(
        ujuziRegistry.connect(validator1).validateEntry(0, true, "Good entry")
      ).to.emit(ujuziRegistry, "EntryValidated");

      const entry = await ujuziRegistry.getEntry(0);
      expect(entry.validationScore).to.equal(1);
    });

    it("Should prevent duplicate validation by same validator", async function () {
      await ujuziRegistry.connect(validator1).validateEntry(0, true, "Good entry");

      await expect(
        ujuziRegistry.connect(validator1).validateEntry(0, true, "Good entry again")
      ).to.be.revertedWith("Already validated");
    });

    it("Should update entry status when validation threshold is met", async function () {
      // Set validation threshold to 2
      await validatorManager.setValidationThreshold(2);

      await ujuziRegistry.connect(validator1).validateEntry(0, true, "Good entry");
      await ujuziRegistry.connect(validator2).validateEntry(0, true, "Excellent entry");

      const entry = await ujuziRegistry.getEntry(0);
      expect(entry.status).to.equal(1); // EntryStatus.Validated
    });

    it("Should reward tokens on successful validation", async function () {
      // Set validation threshold to 1 for testing
      await validatorManager.setValidationThreshold(1);

      const initialAuthorScore = await culturalToken.getCulturalScore(contributor1.address);
      const initialValidatorScore = await culturalToken.getCulturalScore(validator1.address);

      await ujuziRegistry.connect(validator1).validateEntry(0, true, "Good entry");

      const finalAuthorScore = await culturalToken.getCulturalScore(contributor1.address);
      const finalValidatorScore = await culturalToken.getCulturalScore(validator1.address);

      expect(finalAuthorScore).to.equal(initialAuthorScore.add(50)); // Author reward
      expect(finalValidatorScore).to.equal(initialValidatorScore.add(5)); // Validator reward
    });
  });

  describe("Access Control", function () {
    it("Should prevent non-validators from validating", async function () {
      await ujuziRegistry.connect(contributor1).submitEntry(
        sampleCID,
        1,
        sampleLanguage,
        sampleCommunity,
        sampleAtomHashes
      );

      await expect(
        ujuziRegistry.connect(contributor2).validateEntry(0, true, "Trying to validate")
      ).to.be.revertedWith("Not a validator");
    });

    it("Should allow admin to update entry status", async function () {
      await ujuziRegistry.connect(contributor1).submitEntry(
        sampleCID,
        1,
        sampleLanguage,
        sampleCommunity,
        sampleAtomHashes
      );

      await expect(
        ujuziRegistry.connect(owner).updateEntryStatus(0, 3) // EntryStatus.Archived
      ).to.emit(ujuziRegistry, "EntryStatusChanged");

      const entry = await ujuziRegistry.getEntry(0);
      expect(entry.status).to.equal(3); // EntryStatus.Archived
    });

    it("Should prevent non-admin from updating entry status", async function () {
      await ujuziRegistry.connect(contributor1).submitEntry(
        sampleCID,
        1,
        sampleLanguage,
        sampleCommunity,
        sampleAtomHashes
      );

      await expect(
        ujuziRegistry.connect(contributor2).updateEntryStatus(0, 3)
      ).to.be.revertedWith("Only admin can update status");
    });
  });
});