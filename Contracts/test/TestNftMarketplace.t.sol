// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "forge-std/Test.sol";
import "../src/NftMarketplace.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TestNFT is ERC721 {
    uint256 public currentTokenId;

    constructor() ERC721("TestNFT", "TNFT") {}

    function mintTo(address recipient) external returns (uint256) {
        uint256 newTokenId = currentTokenId;
        _safeMint(recipient, newTokenId);
        currentTokenId++;
        return newTokenId;
    }
}

contract NftMarketplaceTest is Test {
    NftMarketplace marketplace;
    TestNFT nft;

    address owner = address(0x100);
    address buyer = address(0x200);

    function setUp() public {
        vm.startPrank(owner);
        marketplace = new NftMarketplace();
        nft = new TestNFT();
        vm.stopPrank();
    }

    function testListAndBuyNft() public {
        uint256 tokenId = nft.mintTo(owner);

        vm.startPrank(owner);
        nft.approve(address(marketplace), tokenId);

        uint256 price = 1 ether;
        marketplace.listNft(address(nft), tokenId, price);
        vm.stopPrank();

        NftMarketplace.Listing memory listing = marketplace.getListing(
            address(nft),
            tokenId
        );
        assertEq(listing.seller, owner);
        assertEq(listing.price, price);

        vm.startPrank(buyer);
        vm.deal(buyer, 10 ether);
        marketplace.buyNft{value: price}(address(nft), tokenId);
        vm.stopPrank();

        assertEq(nft.ownerOf(tokenId), buyer);

        NftMarketplace.Listing memory newListing = marketplace.getListing(
            address(nft),
            tokenId
        );
        assertEq(newListing.seller, address(0));
        assertEq(newListing.price, 0);
    }

    function testListNftNotOwner() public {
        uint256 tokenId = nft.mintTo(owner);

        vm.startPrank(buyer);
        vm.expectRevert(
            NftMarketplace.NftMarketplace__NftListerIsNotTheOwner.selector
        );
        marketplace.listNft(address(nft), tokenId, 1 ether);
        vm.stopPrank();
    }

    function testListNftNotApproved() public {
        uint256 tokenId = nft.mintTo(owner);

        vm.startPrank(owner);
        vm.expectRevert(NftMarketplace.NftMarketplace__NotApproved.selector);
        marketplace.listNft(address(nft), tokenId, 1 ether);
        vm.stopPrank();
    }

    function testBuyNftIncorrectPrice() public {
        uint256 tokenId = nft.mintTo(owner);

        vm.startPrank(owner);
        nft.approve(address(marketplace), tokenId);
        marketplace.listNft(address(nft), tokenId, 1 ether);
        vm.stopPrank();

        vm.deal(buyer, 10 ether);
        vm.startPrank(buyer);
        vm.expectRevert(
            NftMarketplace.NftMarketplace__IncorrectBuyingPrice.selector
        );
        marketplace.buyNft{value: 1.5 ether}(address(nft), tokenId);
        vm.stopPrank();
    }
}
