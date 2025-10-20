// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IUjuziRegistry {
    enum EntryStatus { Pending, Validated, Rejected, Archived }
    enum LicenseType { CommunityOnly, CC_BY_NC, ResearchOnly, OpenAccess }
    
    struct CulturalEntry {
        bytes32 cid;
        address author;
        uint256 timestamp;
        LicenseType license;
        EntryStatus status;
        string language;
        string community;
        uint256 validationScore;
        bytes32[] atomHashes;
    }
    
    function submitEntry(
        bytes32 cid,
        LicenseType license,
        string calldata language,
        string calldata community,
        bytes32[] calldata atomHashes
    ) external returns (uint256);
    
    function validateEntry(
        uint256 entryId,
        bool approve,
        string calldata notes
    ) external;
    
    function getEntry(uint256 entryId) external view returns (CulturalEntry memory);
    
    function getTotalEntries() external view returns (uint256);
}