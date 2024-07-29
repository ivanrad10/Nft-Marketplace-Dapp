import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Nft } from "src/schemas/Nft.schema";
import { Model } from "mongoose";
import { MintNftDto } from "./mintNftDto.dto";
import { client, walletClient } from "../config";

@Injectable()
export class NftService {
    constructor(@InjectModel(Nft.name) private nftModel: Model<Nft>) {}

    addNft(mintNftDto: MintNftDto) {
        const newNft = new this.nftModel(mintNftDto);
        return newNft.save()
    }

    async setNftToListed(tokenUri: string, price: number) {
        await this.nftModel.findOneAndUpdate(
            { tokenUri },
            { $set: { isListed: true, price: price } },
            { new: true }
        ).exec();
    }

    async nftBought(tokenUri: string, address: string) {
        await this.nftModel.findOneAndUpdate(
            { tokenUri },
            { $set: { owner: address, isListed: false, price: 0 } },
            { new: true }
        ).exec();
    }

    async getTokenIdByTokenUri(tokenUri: string, address: string) {
        var fs = require('fs');
        
        const jsonFile = "C:\\Users\\radmi\\Desktop\\test\\backend\\src\\basicNftAbi.json";
        var parsed= JSON.parse(fs.readFileSync(jsonFile));
        var abi = parsed;

        const tokenId = await client.readContract({
            account: `0x${address.substring(2)}`,   //da ne bi doslo do adrese: 0x0x... , trimujem 0x
            address: '0xbdEd0D2bf404bdcBa897a74E6657f1f12e5C6fb6',
            abi: abi,
            functionName: 'getTokenIdByUri',
            args: [tokenUri]
        })

        console.log(tokenId)

        return tokenId
    }

    async approveTransfer(seller: string, contractAddress: string, tokenId: number) {
        var fs = require('fs');
        
        const jsonFile = "C:\\Users\\radmi\\Desktop\\test\\backend\\src\\basicNftAbi.json";
        var parsed= JSON.parse(fs.readFileSync(jsonFile));
        var abi = parsed;

        const { request } = await client.simulateContract({
            account: `0x${seller.substring(2)}`,   // the owner of the nft allows the tx to occur
            address: `0xbdEd0D2bf404bdcBa897a74E6657f1f12e5C6fb6`,
            abi: abi,
            functionName: 'approve',
            args: [contractAddress, tokenId]
        })
        await walletClient.writeContract(request)
    }

    async getNftsByAddress(owner: string): Promise<Nft[]> {
        return this.nftModel.find({ owner }).exec()
    }

    async getNftsForSale(address: string): Promise<Nft[]> {
        return this.nftModel.find({ 
            isListed: true, 
            owner: { $ne: address } 
          }).exec();
    }

    async mint(nft: MintNftDto, address: string) {
        var fs = require('fs');

        const jsonFile = "C:\\Users\\radmi\\Desktop\\test\\backend\\src\\basicNftAbi.json";
        var parsed= JSON.parse(fs.readFileSync(jsonFile));
        var abi = parsed;

        const { request } = await client.simulateContract({
            account: `0x${address.substring(2)}`,   //da ne bi doslo do adrese: 0x0x... , trimujem 0x
            address: '0xbdEd0D2bf404bdcBa897a74E6657f1f12e5C6fb6',
            abi: abi,
            functionName: 'mintNft',
            args: [address, nft.tokenUri]
        })

        const hash = await walletClient.writeContract(request)

        const logs = await client.getContractEvents({ 
            address: "0xbdEd0D2bf404bdcBa897a74E6657f1f12e5C6fb6",
            abi: abi,
            eventName: "NftMinted"
        })

        if (logs) {
            this.addNft(nft)
        }
    }
}