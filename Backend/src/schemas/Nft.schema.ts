import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Nft {
    
    @Prop({ unique: true, required: true})
    tokenUri: string;

    @Prop({ required: true})
    name: string;

    @Prop({ required: true})
    description: string;

    @Prop({ required: true})
    imageUrl: string

    @Prop({ required: true})
    owner: string

    @Prop({ required: true})
    isListed: boolean

    @Prop({ required: true})
    price: number
}

export const NftSchema = SchemaFactory.createForClass(Nft);