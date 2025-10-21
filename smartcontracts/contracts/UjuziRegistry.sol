// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./interfaces/IUjuziRegistry.sol";
import "./CulturalToken.sol";
import "./ValidatorManager.sol";

/**
 * @title UjuziRegistry
 * @dev Main registry for AfriVerse cultural knowledge entries
 * Manages submission, validation, and provenance of indigenous knowledge
 */
contract UjuziRegistry is IUjuziRegistry {
    // Use types from IUjuziRegistry interface
    
    // State variables
    CulturalEntry[] public entries;
    ValidatorManager public validatorManager;
    CulturalToken public culturalToken;
    
    // Mappings
    mapping(uint256 => address[]) public entryValidators;
    mapping(uint256 => mapping(address => bool)) public hasValidated;
    mapping(bytes32 => uint256) public cidToEntryId;
    // Tracks if a CID has already been submitted to prevent duplicates
    mapping(bytes32 => bool) public cidExists;
    mapping(address => uint256[]) public authorEntries;
    
    // Events
    event EntrySubmitted(
        uint256 indexed entryId,
        bytes32 indexed cid,
        address indexed author,
        LicenseType license,
        string language,
        string community
    );
    
    event EntryValidated(
        uint256 indexed entryId,
        address indexed validator,
        bool approved,
        uint256 newScore
    );
    
    event EntryStatusChanged(
        uint256 indexed entryId,
        EntryStatus oldStatus,
        EntryStatus newStatus
    );
    
    // Modifiers
    modifier onlyValidator() {
        require(validatorManager.isValidator(msg.sender), "Not a validator");
        _;
    }
    
    modifier validEntryId(uint256 entryId) {
        require(entryId < entries.length, "Invalid entry ID");
        _;
    }
    
    // Constructor
    constructor(address _validatorManager, address _culturalToken) {
        validatorManager = ValidatorManager(_validatorManager);
        culturalToken = CulturalToken(_culturalToken);
    }
    
    /**
     * @dev Submit a new cultural entry
     */
    function submitEntry(
        bytes32 cid,
        LicenseType license,
        string calldata language,
        string calldata community,
        bytes32[] calldata atomHashes
    ) external returns (uint256) {
        require(cid != bytes32(0), "Invalid CID");
        require(!cidExists[cid], "CID already exists");
        
        uint256 entryId = entries.length;
        
        CulturalEntry memory newEntry = CulturalEntry({
            cid: cid,
            author: msg.sender,
            timestamp: block.timestamp,
            license: license,
            status: EntryStatus.Pending,
            language: language,
            community: community,
            validationScore: 0,
            atomHashes: atomHashes
        });
        
        entries.push(newEntry);
        cidToEntryId[cid] = entryId;
        cidExists[cid] = true;
        authorEntries[msg.sender].push(entryId);
        
        // Mint initial cultural tokens for submission
        culturalToken.mintCulturalTokens(msg.sender, 10);
        
        emit EntrySubmitted(
            entryId,
            cid,
            msg.sender,
            license,
            language,
            community
        );
        
        return entryId;
    }
    
    /**
     * @dev Validate a cultural entry
     */
    function validateEntry(
        uint256 entryId,
        bool approve,
        string calldata notes
    ) external onlyValidator validEntryId(entryId) {
        CulturalEntry storage entry = entries[entryId];
        require(!hasValidated[entryId][msg.sender], "Already validated");
        require(entry.status == EntryStatus.Pending, "Entry not pending");
        
        hasValidated[entryId][msg.sender] = true;
        entryValidators[entryId].push(msg.sender);
        
        if (approve) {
            entry.validationScore++;
        } else {
            entry.validationScore = entry.validationScore > 0 ? entry.validationScore - 1 : 0;
        }
        
        // Check if entry reaches validation threshold
        if (entry.validationScore >= validatorManager.getValidationThreshold()) {
            EntryStatus oldStatus = entry.status;
            entry.status = EntryStatus.Validated;
            emit EntryStatusChanged(entryId, oldStatus, EntryStatus.Validated);
            
            // Reward author and validators
            culturalToken.mintCulturalTokens(entry.author, 50);
            culturalToken.mintCulturalTokens(msg.sender, 5);
        }
        
        emit EntryValidated(entryId, msg.sender, approve, entry.validationScore);
    }
    
    /**
     * @dev Update entry status (admin function)
     */
    function updateEntryStatus(
        uint256 entryId,
        EntryStatus newStatus
    ) external validEntryId(entryId) {
        require(
            validatorManager.isAdmin(msg.sender),
            "Only admin can update status"
        );
        
        CulturalEntry storage entry = entries[entryId];
        EntryStatus oldStatus = entry.status;
        entry.status = newStatus;
        
        emit EntryStatusChanged(entryId, oldStatus, newStatus);
    }
    
    /**
     * @dev Get entry details
     */
    function getEntry(
        uint256 entryId
    ) external view validEntryId(entryId) returns (CulturalEntry memory) {
        return entries[entryId];
    }
    
    /**
     * @dev Get validators for an entry
     */
    function getEntryValidators(
        uint256 entryId
    ) external view validEntryId(entryId) returns (address[] memory) {
        return entryValidators[entryId];
    }
    
    /**
     * @dev Get entries by author
     */
    function getAuthorEntries(
        address author
    ) external view returns (uint256[] memory) {
        return authorEntries[author];
    }
    
    /**
     * @dev Get total entries count
     */
    function getTotalEntries() external view returns (uint256) {
        return entries.length;
    }
    
    /**
     * @dev Check if validator has validated an entry
     */
    function hasValidatorApproved(
        uint256 entryId,
        address validator
    ) external view validEntryId(entryId) returns (bool) {
        return hasValidated[entryId][validator];
    }
}