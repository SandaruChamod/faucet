// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

// they cannot inherite from other smart contracts
// only inherite from other interfaces

// no constructors
// cannot declare state variables
// all declared functions should be external 

interface IFaucet {
    function addFunds() external payable;
    function withdraw(uint256 withdrawAmount) external;
}