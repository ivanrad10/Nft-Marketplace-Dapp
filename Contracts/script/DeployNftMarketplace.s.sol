// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Script} from "forge-std/Script.sol";
import {NftMarketplace} from "../src/NftMarketplace.sol";

/**
 * @title DeployBasicNft
 * @dev A script to deploy a BasicNft contract.
 */
contract DeployNftMarketplace is Script {
    /**
     * @notice Executes the deployment of a DeployNftMarketplace contract.
     * @dev Deploys a new instance of DeployNftMarketplace and returns the deployed contract.
     * @return The deployed DeployNftMarketplace contract instance.
     */
    function run() external returns (NftMarketplace) {
        vm.startBroadcast(); // Start broadcast execution
        NftMarketplace nftMarketplace = new NftMarketplace(); // Deploy a new NftMarketplace contract
        vm.stopBroadcast(); // Stop broadcast execution
        return nftMarketplace; // Return the deployed NftMarketplace contract instance
    }
}
