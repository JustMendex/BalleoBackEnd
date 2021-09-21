import { IsIn, IsNumberString, IsString } from 'class-validator';
import { DraftGender } from '../draft-gender.enum';
import { DraftRole } from '../draft-type.enum';

export class CreateDraftDto {
  @IsString()
  title: string;

  @IsString()
  size: string;

  @IsString()
  condition: string;

  @IsString()
  description: string;

  @IsString()
  style: string;

  @IsString()
  @IsIn([
    DraftRole.Footware,
    DraftRole.Tops,
    DraftRole.Outerwear,
    DraftRole.Bottoms,
    DraftRole.Accessories,
  ])
  category: string;

  @IsString()
  @IsIn([DraftGender.male, DraftGender.female])
  gender: string;

  @IsString()
  subCategory: string;

  @IsString()
  color: string;

  @IsNumberString()
  price: number;
}
