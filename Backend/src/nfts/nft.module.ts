import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Nft, NftSchema } from 'src/schemas/Nft.schema';
import { NftService } from './nft.service';
import { NftController } from './nft.controller';

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: Nft.name,
            schema: NftSchema
        }])
    ],
    providers: [
        NftService
    ],
    controllers: [NftController]
})
export class NftModule {}; 