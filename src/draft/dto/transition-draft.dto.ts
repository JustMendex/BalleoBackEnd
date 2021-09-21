import { IsString, Matches } from 'class-validator';

export class TransitionDraftDto {
  @IsString()
  @Matches(/^[0-9a-fA-F]{24}$/, {
    message: 'Object id not valid',
  })
  _id: string;

  @IsString()
  placement: string;
}
