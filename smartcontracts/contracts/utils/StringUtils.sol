// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title StringUtils
 * @dev Utility functions for string operations
 */
library StringUtils {
    /**
     * @dev Concatenate two strings
     */
    function concatenate(string memory a, string memory b) internal pure returns (string memory) {
        return string(abi.encodePacked(a, b));
    }
    
    /**
     * @dev Compare two strings
     */
    function compare(string memory a, string memory b) internal pure returns (bool) {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }
    
    /**
     * @dev Check if string is empty
     */
    function isEmpty(string memory a) internal pure returns (bool) {
        return bytes(a).length == 0;
    }
    
    /**
     * @dev Convert address to string
     */
    function addressToString(address addr) internal pure returns (string memory) {
        bytes32 value = bytes32(uint256(uint160(addr)));
        bytes memory alphabet = "0123456789abcdef";
        
        bytes memory str = new bytes(42);
        str[0] = '0';
        str[1] = 'x';
        for (uint i = 0; i < 20; i++) {
            str[2+i*2] = alphabet[uint8(value[i + 12] >> 4)];
            str[3+i*2] = alphabet[uint8(value[i + 12] & 0x0f)];
        }
        return string(str);
    }
}