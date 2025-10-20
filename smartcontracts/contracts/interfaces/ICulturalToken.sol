// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface ICulturalToken {
    function mintCulturalTokens(address to, uint256 amount) external;
    function burnCulturalTokens(address from, uint256 amount) external;
    function getCulturalScore(address account) external view returns (uint256);
}