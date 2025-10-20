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
    // ... (rest of V1 implementation)
    
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
}