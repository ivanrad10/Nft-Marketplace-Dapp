// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title BasicNft
 * @dev ERC721 implementation for minting NFTs with token URIs.
 */
contract BasicNft is ERC721, Ownable {
    uint256 private s_tokenCounter;
    mapping(uint256 => string) private s_tokenIdToUri;
    mapping(string => uint256) private s_tokenUriToId;
    mapping(address => bool) private s_blackList;

    event NftMinted(string indexed tokenUri, address recipient);

    error CallerIsBlackListed(address caller);

    /**
     * @dev Constructor initializes the ERC721 contract with a name and symbol.
     */
    constructor() ERC721("Ethereal Artifacts", "ETHA") Ownable(msg.sender) {
        s_tokenCounter = 0;
    }

    /**
     * @notice Mints a new NFT.
     * @dev Mints a new NFT with a specified token URI to the recipient address.
     * @param recipient The address that will receive the minted NFT.
     * @param tokenUri The URI of the token metadata.
     */
    function mintNft(
        address recipient,
        string memory tokenUri
    ) public isBlackListed {
        s_tokenIdToUri[s_tokenCounter] = tokenUri;
        s_tokenUriToId[tokenUri] = s_tokenCounter;
        _safeMint(recipient, s_tokenCounter);
        s_tokenCounter++;

        emit NftMinted(tokenUri, recipient);
    }

    /**
     * @dev Modifier to make a function callable only when the caller is not blacklisted.
     * Reverts with `CallerIsBlacklisted` if the caller is blacklisted.
     */
    modifier isBlackListed() {
        if (s_blackList[msg.sender]) {
            revert CallerIsBlackListed(msg.sender);
        }
        _;
    }

    /**
     * @dev Adds an address to the blacklist.
     * Can only be called by the owner.
     * @param user The address to be added to the blacklist.
     */
    function addToBlackList(address user) public onlyOwner {
        s_blackList[user] = true;
    }

    /**
     * @notice Returns the token URI for a given token ID.
     * @dev Overrides the base ERC721 implementation to return the stored token URI.
     * @param tokenId The ID of the token.
     * @return The token URI.
     */
    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        return s_tokenIdToUri[tokenId];
    }

    /// @notice Retrieves the token ID associated with a given token URI
    /// @dev This function assumes that the token URI mapping is correctly maintained
    /// @param tokenUri The URI of the token to look up
    /// @return The ID of the token associated with the provided URI
    function getTokenIdByUri(
        string memory tokenUri
    ) public view returns (uint256) {
        return s_tokenUriToId[tokenUri];
    }

    /**
     * @notice Checks if an address is blacklisted.
     * @param user The address to check.
     * @return True if the address is blacklisted, false otherwise.
     */
    function isAddressBlackListed(address user) public view returns (bool) {
        return s_blackList[user];
    }
}
