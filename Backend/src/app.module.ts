import { Module } from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { NftModule } from './nfts/nft.module';


@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/nftMarketplaceDatabase'),
    UserModule,
    AuthModule,
    NftModule,
    ConfigModule.forRoot({
      isGlobal: true,
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
