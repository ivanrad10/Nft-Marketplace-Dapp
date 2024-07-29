// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

/// @title NftMarketplace
/// @notice A marketplace contract for listing and buying ERC721 NFTs
contract NftMarketplace {
    struct Listing {
        address seller;
        uint256 price;
    }

    /// @dev Mapping to store listings for each NFT contract and token ID
    mapping(address => mapping(uint256 => Listing)) public listings;

    /// @dev Event emitted when an NFT is listed for sale
    event NftListed(
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        uint256 price
    );

    /// @dev Event emitted when an NFT is successfully bought
    event NftBought(
        address indexed nftContract,
        uint256 indexed tokenId,
        address buyer,
        uint256 price
    );

    /// @dev Error codes
    error NftMarketplace__NftListerIsNotTheOwner();
    error NftMarketplace__NotApproved();
    error NftMarketplace__IncorrectBuyingPrice();
    error NftMarketplace__ErrorPayingOutTheSeller();
    error NftMarketplace__NotApprovedForTransfer();

    /// @dev Constructor
    constructor() {}

    /// @notice Lists an NFT for sale on the marketplace
    /// @param nftContract Address of the ERC721 NFT contract
    /// @param tokenId ID of the token to be listed
    /// @param price Price at which the NFT is listed
    function listNft(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) public {
        IERC721 nft = IERC721(nftContract);
        if (nft.ownerOf(tokenId) != msg.sender) {
            revert NftMarketplace__NftListerIsNotTheOwner();
        }

        listings[nftContract][tokenId] = Listing(msg.sender, price);
        emit NftListed(nftContract, tokenId, msg.sender, price);
    }

    /// @notice Buys an NFT listed on the marketplace
    /// @param nftContract Address of the ERC721 NFT contract
    /// @param tokenId ID of the token to be bought
    function buyNft(address nftContract, uint256 tokenId) public payable {
        Listing memory listing = listings[nftContract][tokenId];

        if (listing.price != msg.value) {
            revert NftMarketplace__IncorrectBuyingPrice();
        }

        address approvedAddress = IERC721(nftContract).getApproved(tokenId);
        if (approvedAddress != address(this)) {
            revert NftMarketplace__NotApprovedForTransfer();
        }

        delete listings[nftContract][tokenId];
        IERC721(nftContract).safeTransferFrom(
            listing.seller,
            msg.sender,
            tokenId
        );

        (bool success, ) = payable(listing.seller).call{value: msg.value}("");
        if (!success) {
            revert NftMarketplace__ErrorPayingOutTheSeller();
        }

        emit NftBought(nftContract, tokenId, msg.sender, msg.value);
    }

    /// @notice Retrieves the current listing information of an NFT
    /// @param nftContract Address of the ERC721 NFT contract
    /// @param tokenId ID of the token
    /// @return Listing information including seller address and price
    function getListing(
        address nftContract,
        uint256 tokenId
    ) public view returns (Listing memory) {
        return listings[nftContract][tokenId];
    }
}
