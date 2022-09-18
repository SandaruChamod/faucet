// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "./Owned.sol";
import "./Logger.sol";
import "./IFaucet.sol";

contract Faucet is Owned, Logger, IFaucet {
    uint256 public numOfFunders;
    mapping(address => bool) private funders;
    mapping(uint256 => address) private lutFunders;

    modifier limitWithdraw(uint256 withdrawAmount) {
        require(
            withdrawAmount <= 1000000000000000000,
            "Cannot withraw more than 1 ether"
        );
        _;
    }

    receive() external payable {}

    function addFunds() external override payable {
        address funder = msg.sender;

        if (!funders[funder]) {
            uint256 index = numOfFunders++;
            funders[funder] = true;
            lutFunders[index] = funder;
        }
    }

    function withdraw(uint256 withdrawAmount) external override limitWithdraw(withdrawAmount) {
        payable(msg.sender).transfer(withdrawAmount);
    }

    // only owner can access this
    function test1() external onlyOwner{}

    function emitLog() public override pure returns(bytes32) {
        test3();
        return "emitLog Triggered";
    }

    function getAllFunders() public view returns (address[] memory) {
        address[] memory _funders = new address[](numOfFunders);

        for (uint256 i = 0; i < numOfFunders; i++) {
            _funders[i] = lutFunders[i];
        }

        return _funders;
    }

    // function justTesting() external pure returns(uint) {
    //     return 5 + 5;
    // }

    function getFunderAtIndex(uint8 index) public view returns (address) {
        return lutFunders[index];
    }

    // truffle migrate --reset
    // truffle console

    // const instance = await Faucet.deployed()
    // instance.addFunds({from: accounts[0], value: "2000000000000000000"})
    // instance.addFunds({from: accounts[1], value: "2000000000000000000"})
    // instance.getAllFunders()
    // instance.getFunderAtIndex(0)
    // instance.withdraw("500000000000000000", {from: accounts[1]})
    // instance.withdraw("5000000000000000000", {from: accounts[1]})
    // instance.test1()
    // instance.test1({from: accounts[5]})
    // instance.emitLog()
}
