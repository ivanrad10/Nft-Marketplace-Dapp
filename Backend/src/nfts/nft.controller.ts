import { Body, Controller, Post, Get, UsePipes, ValidationPipe, Param } from "@nestjs/common";
import { NftService } from "./nft.service";
import { MintNftDto } from "./mintNftDto.dto";
import { client, walletClient } from "../config";
import { BigNumber } from 'bignumber.js';
const pinataSDK = require('@pinata/sdk');
const fs = require('fs');

@Controller('nfts')
export class NftController{
    
    constructor(private nftService: NftService) {}

    @Post('pinToPinata')
    async pinToPinata(@Body() piningFiles: {address: string, name: string, description: string, imgUrl: string}) {
        const {address, name, description, imgUrl} = piningFiles

        const pinata = new pinataSDK({ pinataJWTKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIyYTI1ODczOS03MGU2LTQ4M2QtOWMzYi0xOWRmMDIxOGJhYTUiLCJlbWFpbCI6InJhZG1pbG92aWNpdmFuQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiIyMGQwZjJkZGE4MDAzNTBjYzhiOCIsInNjb3BlZEtleVNlY3JldCI6IjRkZmQ5MmMwZjUxMjQ0YWQzYzBkODUyMGJjYTFmNDZlZDUxOGYwMTEyYmNmNGI4OTBlNzJmNzllZDQzN2FmZDgiLCJleHAiOjE3NTI0MjI0Njl9.Tm5L0nJx7-8QmVSnqgBbwuQ1T764-cQb4TWU5bpQNV8'});
        
        const readableStreamForFile = fs.createReadStream(imgUrl);
        const optionsPicture = {
            pinataMetadata: {
                name: name + "Pic"
            },
            pinataOptions: {
                cidVersion: 0
            }
        };
        const image = await pinata.pinFileToIPFS(readableStreamForFile, optionsPicture)

        const options = {
            pinataMetadata: {
                name: name
            },
            pinataOptions: {
                cidVersion: 0
            }
        };
        const body = {
            name: name,
            description: description,
            imgUrl: image.IpfsHash
        };
        const nft = await pinata.pinJSONToIPFS(body, options)
        
        const newNft = new MintNftDto(nft.IpfsHash, name, description, image.IpfsHash, address);
        
        console.log(newNft)

        await this.nftService.mint(newNft, address)
    } 
    
    @Post('listnft')
    async listNft(@Body() listingData: {tokenUri: string, price: number, address: string}) {
        const {tokenUri, price, address} = listingData

        var fs = require('fs');
        
        const jsonFile = "C:\\Users\\radmi\\Desktop\\test\\backend\\src\\nftMarketplaceAbi.json";
        var parsed= JSON.parse(fs.readFileSync(jsonFile));
        var abi = parsed;

        let tokenId = await this.nftService.getTokenIdByTokenUri(tokenUri, address)
        
        const { request } = await client.simulateContract({
            account: `0x${address.substring(2)}`,   //da ne bi doslo do adrese: 0x0x... , trimujem 0x
            address: '0x2910E325cf29dd912E3476B61ef12F49cb931096',
            abi: abi,
            functionName: 'listNft',
            args: ["0xbdEd0D2bf404bdcBa897a74E6657f1f12e5C6fb6", tokenId, price * 1e18]
        })
        await walletClient.writeContract(request)

        const logs = await client.getContractEvents({ 
            address: "0x2910E325cf29dd912E3476B61ef12F49cb931096",
            abi: abi,
            eventName: 'NftListed',
        })

        if (logs) {
            await this.nftService.setNftToListed(tokenUri, price)
        }
    }

    @Post('buy')
    async buyNft(@Body() buyingData: {tokenUri: string, price: number, buyer: string, owner: string}) {
        var fs = require('fs');
        
        const jsonFile = "C:\\Users\\radmi\\Desktop\\test\\backend\\src\\nftMarketplaceAbi.json";
        var parsed= JSON.parse(fs.readFileSync(jsonFile));
        var marketplaceAbi = parsed;

        const json = "C:\\Users\\radmi\\Desktop\\test\\backend\\src\\basicNftAbi.json";
        var parsed= JSON.parse(fs.readFileSync(json));
        var basicNftAbi = parsed;

        const {tokenUri, price, buyer, owner} = buyingData
        let tokenId = await this.nftService.getTokenIdByTokenUri(tokenUri, buyer)

        await this.nftService.approveTransfer(owner, "0x2910E325cf29dd912E3476B61ef12F49cb931096", tokenId as number)

        const { request } = await client.simulateContract({
            account: `0x${buyer.substring(2)}`,   //da ne bi doslo do adrese: 0x0x... , trimujem 0x
            address: '0x2910E325cf29dd912E3476B61ef12F49cb931096',
            abi: marketplaceAbi,
            functionName: 'buyNft',
            args: ["0xbdEd0D2bf404bdcBa897a74E6657f1f12e5C6fb6", tokenId],
            value: new BigNumber(price * 1e18)
        })
        await walletClient.writeContract(request)

        const logs = await client.getContractEvents({ 
            address: "0x2910E325cf29dd912E3476B61ef12F49cb931096",
            abi: marketplaceAbi,
            eventName: 'NftBought',
        })

        console.log(logs)

        if (logs) {
            await this.nftService.nftBought(tokenUri, buyer)
        }
    }

    @Get(':address')
    async getNftsByAddress(@Param('address') address: string) {
        return this.nftService.getNftsByAddress(address)
    }

    @Get('forsale/:address')
    async getNftsForSale(@Param('address') address: string) {
        return this.nftService.getNftsForSale(address)
    }

}