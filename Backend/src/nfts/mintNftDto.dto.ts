import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class MintNftDto{
    @IsNotEmpty()
    @IsString()
    tokenUri: string;

    @IsString()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    description: string

    @IsNotEmpty()
    @IsString()
    imageUrl: string

    @IsNotEmpty()
    @IsString()
    owner: string

    @IsNotEmpty()
    @IsBoolean()
    isListed: boolean

    @IsNotEmpty()
    @IsNumber()
    price: number

    constructor(tokenUri: string, name: string, description: string, imageUrl: string, owner: string, isListed: boolean = false, price: number = 0) {
        this.tokenUri = tokenUri;
        this.name = name;
        this.description = description;
        this.imageUrl = imageUrl;
        this.owner = owner;
        this.isListed = isListed
        this.price = price
    }
}