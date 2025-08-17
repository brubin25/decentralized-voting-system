// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimpleStorage {
    uint256 private number;

    // 设置数字
    function setNumber(uint256 _number) public {
        number = _number;
    }

    // 获取数字
    function getNumber() public view returns (uint256) {
        return number;
    }
}
