// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Script} from "forge-std/Script.sol";
import {BasicNft} from "../src/BasicNft.sol";

/**
 * @title DeployBasicNft
 * @dev A script to deploy a BasicNft contract.
 */
contract DeployBasicNft is Script {
    /**
     * @notice Executes the deployment of a BasicNft contract.
     * @dev Deploys a new instance of BasicNft and returns the deployed contract.
     * @return The deployed BasicNft contract instance.
     */
    function run() external returns (BasicNft) {
        vm.startBroadcast(); // Start broadcast execution
        BasicNft basicNft = new BasicNft(); // Deploy a new BasicNft contract
        vm.stopBroadcast(); // Stop broadcast execution
        return basicNft; // Return the deployed BasicNft contract instance
    }
}
