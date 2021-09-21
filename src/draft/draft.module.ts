import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Draft, DraftSchema } from './draft.schema';
import { DraftController } from './draft.controller';
import { DraftService } from './draft.service';
import { FilesModule } from 'src/files/files.module';
import { AuthModule } from 'src/auth/auth.module';
import { ListingModule } from 'src/listing/listing.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Draft.name, schema: DraftSchema }]),
    FilesModule,
    AuthModule,
    ListingModule,
  ],
  controllers: [DraftController],
  providers: [DraftService],
})
export class DraftModule {}
