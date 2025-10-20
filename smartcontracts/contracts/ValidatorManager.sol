// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title ValidatorManager
 * @dev Manages validators and their permissions for AfriVerse
 */
contract ValidatorManager is AccessControl {
    bytes32 public constant VALIDATOR_ROLE = keccak256("VALIDATOR_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    
    uint256 public validationThreshold = 3; // Minimum validations required
    uint256 public validatorStake = 0.01 ether; // Stake required to become validator
    
    // Validator info
    struct ValidatorInfo {
        uint256 stake;
        uint256 validationCount;
        uint256 correctValidations;
        uint256 reputation;
        bool isActive;
        uint256 joinDate;
    }
    
    mapping(address => ValidatorInfo) public validators;
    address[] public validatorList;
    
    // Events
    event ValidatorAdded(address indexed validator, uint256 stake);
    event ValidatorRemoved(address indexed validator);
    event ValidationThresholdUpdated(uint256 oldThreshold, uint256 newThreshold);
    event ValidatorStakeUpdated(uint256 oldStake, uint256 newStake);
    event ValidatorReputationUpdated(address indexed validator, uint256 newReputation);
    
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }
    
    /**
     * @dev Apply to become a validator by staking tokens
     */
    function applyAsValidator() external payable {
        require(!isValidator(msg.sender), "Already a validator");
        require(msg.value >= validatorStake, "Insufficient stake");
        
        validators[msg.sender] = ValidatorInfo({
            stake: msg.value,
            validationCount: 0,
            correctValidations: 0,
            reputation: 100, // Starting reputation
            isActive: true,
            joinDate: block.timestamp
        });
        
        validatorList.push(msg.sender);
        _grantRole(VALIDATOR_ROLE, msg.sender);
        
        emit ValidatorAdded(msg.sender, msg.value);
    }
    
    /**
     * @dev Remove a validator (admin function)
     */
    function removeValidator(address validator) external onlyRole(ADMIN_ROLE) {
        require(isValidator(validator), "Not a validator");
        
        // Return stake
        uint256 stake = validators[validator].stake;
        if (stake > 0) {
            payable(validator).transfer(stake);
        }
        
        validators[validator].isActive = false;
        _revokeRole(VALIDATOR_ROLE, validator);
        
        emit ValidatorRemoved(validator);
    }
    
    /**
     * @dev Update validator reputation
     */
    function updateValidatorReputation(
        address validator,
        bool correctValidation
    ) external onlyRole(ADMIN_ROLE) {
        require(isValidator(validator), "Not a validator");
        
        ValidatorInfo storage info = validators[validator];
        info.validationCount++;
        
        if (correctValidation) {
            info.correctValidations++;
        }
        
        // Calculate reputation (percentage of correct validations)
        if (info.validationCount > 0) {
            info.reputation = (info.correctValidations * 100) / info.validationCount;
        }
        
        emit ValidatorReputationUpdated(validator, info.reputation);
    }
    
    /**
     * @dev Set validation threshold
     */
    function setValidationThreshold(uint256 newThreshold) external onlyRole(ADMIN_ROLE) {
        require(newThreshold > 0, "Threshold must be positive");
        uint256 oldThreshold = validationThreshold;
        validationThreshold = newThreshold;
        
        emit ValidationThresholdUpdated(oldThreshold, newThreshold);
    }
    
    /**
     * @dev Set validator stake amount
     */
    function setValidatorStake(uint256 newStake) external onlyRole(ADMIN_ROLE) {
        uint256 oldStake = validatorStake;
        validatorStake = newStake;
        
        emit ValidatorStakeUpdated(oldStake, newStake);
    }
    
    /**
     * @dev Check if address is validator
     */
    function isValidator(address account) public view returns (bool) {
        return hasRole(VALIDATOR_ROLE, account) && validators[account].isActive;
    }
    
    /**
     * @dev Check if address is admin
     */
    function isAdmin(address account) public view returns (bool) {
        return hasRole(ADMIN_ROLE, account);
    }
    
    /**
     * @dev Get validation threshold
     */
    function getValidationThreshold() external view returns (uint256) {
        return validationThreshold;
    }
    
    /**
     * @dev Get validator count
     */
    function getValidatorCount() external view returns (uint256) {
        return validatorList.length;
    }
    
    /**
     * @dev Get all validators
     */
    function getAllValidators() external view returns (address[] memory) {
        return validatorList;
    }
    
    /**
     * @dev Get validator info
     */
    function getValidatorInfo(address validator) external view returns (ValidatorInfo memory) {
        return validators[validator];
    }
}