//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract DappName {
    string dapp_name;

    constructor() {
        console.log("Deploying a DappName with DappName:", dapp_name);
        dapp_name = "Name of the Dapp";
    }

    function readName() public view returns (string memory) {
        return dapp_name;
    }

    function setName(string memory _dapp_name) public {
        console.log(
            "Changing the Dapp Name from '%s' to '%s'",
            dapp_name,
            _dapp_name
        );
        dapp_name = _dapp_name;
    }
}
