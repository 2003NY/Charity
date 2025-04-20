// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CharityFund {
    address public owner;
    uint256 public threshold = 0.1 ether;
    uint256 public totalAmount;

    event FundDeposited(address indexed donor, uint256 amount);
    event FundsTransferred(address indexed recipient, uint256 amount);

    constructor() {
        owner = msg.sender;
        totalAmount = 0;
    }

    // Accept ETH donations and trigger transfer if threshold reached
    function deposit() public payable {
        require(msg.value > 0, "Must send some Ether");

        totalAmount += msg.value;
        emit FundDeposited(msg.sender, msg.value);

        if (totalAmount >= threshold) {
            transferFunds();
        }
    }

    // Internal transfer to the owner's address when threshold is met
    function transferFunds() internal {
        uint256 amountToTransfer = totalAmount;
        totalAmount = 0;

        (bool sent, ) = payable(owner).call{value: amountToTransfer}("");
        require(sent, "Failed to send Ether");

        emit FundsTransferred(owner, amountToTransfer);
    }

    // Public function to check contract balance
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
