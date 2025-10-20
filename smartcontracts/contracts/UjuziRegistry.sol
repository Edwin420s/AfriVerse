// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title UjuziRegistry
 * @dev Smart contract for registering and validating cultural knowledge entries
 * on the AfriVerse platform
 */
contract UjuziRegistry {
    struct Entry {
        bytes32 cid;        // IPFS content identifier
        address author;     // Submitter's address
        uint256 timestamp;  // Submission time
        string license;     // Content license
        uint8 status;       // 0=pending, 1=validated, 2=rejected
    }
    
    // Storage
    Entry[] public entries;
    mapping(uint => address[]) public validators;
    mapping(address => uint) public reputation;
    
    // Events
    event EntrySubmitted(
        uint indexed entryId, 
        bytes32 indexed cid, 
        address author,
        string license
    );
    
    event EntryValidated(
        uint indexed entryId, 
        bool approved, 
        address validator,
        string notes
    );
    
    event ReputationUpdated(
        address user, 
        uint newReputation,
        string reason
    );
    
    // Modifiers
    modifier validEntryId(uint entryId) {
        require(entryId < entries.length, "Invalid entry ID");
        _;
    }
    
    modifier onlyValidator(uint entryId) {
        require(isValidator(entryId, msg.sender), "Not a validator for this entry");
        _;
    }
    
    /**
     * @dev Submit a new cultural knowledge entry
     * @param cid IPFS content identifier
     * @param license Content license string
     */
    function submitEntry(
        bytes32 cid, 
        string calldata license
    ) external returns (uint) {
        require(cid != bytes32(0), "Invalid CID");
        require(bytes(license).length > 0, "License required");
        
        entries.push(Entry({
            cid: cid,
            author: msg.sender,
            timestamp: block.timestamp,
            license: license,
            status: 0
        }));
        
        uint entryId = entries.length - 1;
        
        emit EntrySubmitted(entryId, cid, msg.sender, license);
        
        // Auto-add submitter as initial validator
        validators[entryId].push(msg.sender);
        
        return entryId;
    }
    
    /**
     * @dev Validate or reject an entry
     * @param entryId ID of the entry to validate
     * @param approve True to approve, false to reject
     * @param notes Reason for decision
     */
    function validateEntry(
        uint entryId, 
        bool approve, 
        string calldata notes
    ) external validEntryId(entryId) onlyValidator(entryId) {
        Entry storage entry = entries[entryId];
        
        require(entry.status == 0, "Entry already processed");
        
        if (approve) {
            entry.status = 1;
            // Increase reputation for author and validator
            reputation[entry.author] += 10;
            reputation[msg.sender] += 5;
            
            emit ReputationUpdated(entry.author, reputation[entry.author], "Entry validated");
            emit ReputationUpdated(msg.sender, reputation[msg.sender], "Successful validation");
        } else {
            entry.status = 2;
            // Decrease reputation for invalid submissions
            if (reputation[entry.author] > 5) {
                reputation[entry.author] -= 5;
                emit ReputationUpdated(entry.author, reputation[entry.author], "Entry rejected");
            }
        }
        
        validators[entryId].push(msg.sender);
        
        emit EntryValidated(entryId, approve, msg.sender, notes);
    }
    
    /**
     * @dev Add a validator for an entry
     * @param entryId Entry ID
     * @param validator Validator address
     */
    function addValidator(
        uint entryId, 
        address validator
    ) external validEntryId(entryId) {
        require(!isValidator(entryId, validator), "Already a validator");
        validators[entryId].push(validator);
    }
    
    /**
     * @dev Get entry details
     * @param entryId Entry ID
     */
    function getEntry(
        uint entryId
    ) external view validEntryId(entryId) returns (
        bytes32 cid,
        address author,
        uint256 timestamp,
        string memory license,
        uint8 status,
        address[] memory entryValidators
    ) {
        Entry memory entry = entries[entryId];
        return (
            entry.cid,
            entry.author,
            entry.timestamp,
            entry.license,
            entry.status,
            validators[entryId]
        );
    }
    
    /**
     * @dev Check if address is validator for entry
     * @param entryId Entry ID
     * @param validator Address to check
     */
    function isValidator(
        uint entryId, 
        address validator
    ) public view validEntryId(entryId) returns (bool) {
        address[] memory entryValidators = validators[entryId];
        for (uint i = 0; i < entryValidators.length; i++) {
            if (entryValidators[i] == validator) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * @dev Get total entry count
     */
    function getEntryCount() external view returns (uint) {
        return entries.length;
    }
    
    /**
     * @dev Get entries by status
     * @param status Status to filter by
     * @param limit Maximum number of entries to return
     */
    function getEntriesByStatus(
        uint8 status, 
        uint limit
    ) external view returns (uint[] memory) {
        uint count = 0;
        uint[] memory result = new uint[](limit);
        
        for (uint i = 0; i < entries.length && count < limit; i++) {
            if (entries[i].status == status) {
                result[count] = i;
                count++;
            }
        }
        
        // Resize array to actual count
        uint[] memory finalResult = new uint[](count);
        for (uint j = 0; j < count; j++) {
            finalResult[j] = result[j];
        }
        
        return finalResult;
    }
    
    /**
     * @dev Get user's reputation score
     * @param user Address to check
     */
    function getReputation(address user) external view returns (uint) {
        return reputation[user];
    }
}