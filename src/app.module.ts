import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { DraftModule } from './draft/draft.module';
import { ListingModule } from './listing/listing.module';
import { FilesModule } from './files/files.module';
import * as envConfig from 'config';

const databaseConfig = envConfig.get('db');

@Module({
  imports: [
    MongooseModule.forRoot(databaseConfig.uri, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    }),
    AuthModule,
    OrderModule,
    DraftModule,
    ListingModule,
    FilesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
