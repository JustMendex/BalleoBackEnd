import { IsIn, IsString, Matches } from 'class-validator';
import { DraftStatus } from '../draft-status.enum';

export class UpdateDraftStatusDto {
  @IsString()
  @Matches(/^[0-9a-fA-F]{24}$/, {
    message: 'Object id not valid',
  })
  _id: string;

  @IsString()
  @IsIn([
    DraftStatus.accepted,
    DraftStatus.rejected,
    DraftStatus.pickedUp,
    DraftStatus.waitingPickUp,
  ])
  status: string;
}
