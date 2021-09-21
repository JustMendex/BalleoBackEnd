import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { Listing, ListingSchema } from './listing.schema';
import { ListingService } from './listing.service';
import { ListingController } from './listing.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Listing.name, schema: ListingSchema }]),
    AuthModule,
  ],
  providers: [ListingService],
  exports: [ListingService],
  controllers: [ListingController],
})
export class ListingModule {}
