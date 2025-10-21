// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "./interfaces/IUjuziRegistry.sol";

/**
 * @title UjuziRegistryV2
 * @dev Upgradeable version of UjuziRegistry with additional features
 */
contract UjuziRegistryV2 is Initializable, AccessControlUpgradeable, IUjuziRegistry {
    bytes32 public constant VALIDATOR_ROLE = keccak256("VALIDATOR_ROLE");
    
    // Existing state variables from V1
    CulturalEntry[] public entries;
    mapping(uint256 => address[]) public entryValidators;
    mapping(uint256 => mapping(address => bool)) public hasValidated;
    mapping(bytes32 => uint256) public cidToEntryId;
    mapping(bytes32 => bool) public cidExists;
    mapping(address => uint256[]) public authorEntries;
    
    // New V2 state variables
    mapping(uint256 => string[]) public entryTags;
    mapping(string => uint256[]) public tagToEntries;
    uint256 public entryVersion;
    
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }
    
    function initialize(address admin) public initializer {
        __AccessControl_init();
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        entryVersion = 2;
    }
    
    // New V2 functions
    function addTagsToEntry(uint256 entryId, string[] calldata tags) external {
        require(entryId < entries.length, "Invalid entry ID");
        require(hasRole(VALIDATOR_ROLE, msg.sender) || entries[entryId].author == msg.sender, "Not authorized");
        
        for (uint i = 0; i < tags.length; i++) {
            entryTags[entryId].push(tags[i]);
            tagToEntries[tags[i]].push(entryId);
        }
    }
    
    function getEntriesByTag(string calldata tag) external view returns (uint256[] memory) {
        return tagToEntries[tag];
    }
    
    function getEntryTags(uint256 entryId) external view returns (string[] memory) {
        return entryTags[entryId];
    }
    
    function getVersion() external view returns (uint256) {
        return entryVersion;
    }
    
    // Implement required interface methods
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
        
        return entryId;
    }
    
    function validateEntry(
        uint256 entryId,
        bool approve,
        string calldata notes
    ) external {
        require(hasRole(VALIDATOR_ROLE, msg.sender), "Not a validator");
        require(entryId < entries.length, "Invalid entry ID");
        require(!hasValidated[entryId][msg.sender], "Already validated");
        
        CulturalEntry storage entry = entries[entryId];
        require(entry.status == EntryStatus.Pending, "Entry not pending");
        
        hasValidated[entryId][msg.sender] = true;
        entryValidators[entryId].push(msg.sender);
        
        if (approve) {
            entry.validationScore++;
        } else {
            entry.validationScore = entry.validationScore > 0 ? entry.validationScore - 1 : 0;
        }
        
        // Check if entry reaches validation threshold (e.g., 3 validators)
        if (entry.validationScore >= 3) {
            entry.status = EntryStatus.Validated;
        }
    }
    
    function getEntry(uint256 entryId) external view returns (CulturalEntry memory) {
        require(entryId < entries.length, "Invalid entry ID");
        return entries[entryId];
    }
    
    function getTotalEntries() external view returns (uint256) {
        return entries.length;
    }
}