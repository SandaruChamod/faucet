// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

abstract contract Logger {
    uint testNum;

    constructor() {
        testNum = 100;
    }

    function emitLog() public virtual returns(bytes32);

    function test3() public pure returns(bytes32) {
        return "test3 Triggered!";
    }
}