import { IsArray, IsIn, IsNumberString, IsString } from 'class-validator';
import { ListingGender } from '../listing-gender.enum';
import { ListingRole } from '../listing-type.enum';

export class CreateListingtDto {
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
    ListingRole.Footware,
    ListingRole.Tops,
    ListingRole.Outerwear,
    ListingRole.Bottoms,
    ListingRole.Accessories,
  ])
  category: string;

  @IsString()
  @IsIn([ListingGender.male, ListingGender.female])
  gender: string;

  @IsString()
  subCategory: string;

  @IsString()
  color: string;

  @IsString()
  placement: string;

  @IsArray()
  images: Record<string, string>[];

  @IsNumberString()
  price: number;
}
