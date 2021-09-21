import { IsString, Matches } from 'class-validator';
import { CreateDraftDto } from './create-draft.dto';

export class UpdateDraftDetailsDto extends CreateDraftDto {
  @IsString()
  @Matches(/^[0-9a-fA-F]{24}$/, {
    message: 'Object id not valid',
  })
  _id: string;
}

//
