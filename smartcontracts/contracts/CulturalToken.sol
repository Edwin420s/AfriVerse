// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./interfaces/ICulturalToken.sol";

/**
 * @title CulturalToken
 * @dev ERC20 token for rewarding cultural contributions in AfriVerse
 * Non-transferable reputation token for cultural validation
 */
contract CulturalToken is ERC20, AccessControl, ICulturalToken {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    
    // Mapping to track minted tokens per address
    mapping(address => uint256) public culturalScores;
    
    // Events
    event CulturalTokensMinted(address indexed to, uint256 amount, string reason);
    event CulturalTokensBurned(address indexed from, uint256 amount, string reason);
    
    constructor() ERC20("AfriVerse Cultural Token", "AFRIC") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(BURNER_ROLE, msg.sender);
    }
    
    /**
     * @dev Mint cultural tokens for contributions
     */
    function mintCulturalTokens(
        address to,
        uint256 amount
    ) external override onlyRole(MINTER_ROLE) {
        _mint(to, amount);
        culturalScores[to] += amount;
        emit CulturalTokensMinted(to, amount, "Cultural contribution reward");
    }
    
    /**
     * @dev Burn cultural tokens (for penalties)
     */
    function burnCulturalTokens(
        address from,
        uint256 amount
    ) external override onlyRole(BURNER_ROLE) {
        _burn(from, amount);
        culturalScores[from] = culturalScores[from] > amount ? 
            culturalScores[from] - amount : 0;
        emit CulturalTokensBurned(from, amount, "Penalty or adjustment");
    }
    
    /**
     * @dev Override transfer to make token non-transferable
     */
    function transfer(address to, uint256 amount) public override returns (bool) {
        revert("Cultural tokens are non-transferable");
    }
    
    /**
     * @dev Override transferFrom to make token non-transferable
     */
    function transferFrom(address from, address to, uint256 amount) public override returns (bool) {
        revert("Cultural tokens are non-transferable");
    }
    
    /**
     * @dev Get cultural score for an address
     */
    function getCulturalScore(address account) external view returns (uint256) {
        return culturalScores[account];
    }
    
    /**
     * @dev Check if address has minimum cultural score
     */
    function hasMinimumScore(address account, uint256 minScore) external view returns (bool) {
        return culturalScores[account] >= minScore;
    }
}
