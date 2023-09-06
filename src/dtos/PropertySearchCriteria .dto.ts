import { IsString, IsInt, IsOptional } from 'class-validator';

export class PropertySearchCriteria {
  @IsOptional()
  @IsInt()
  zip: number;

  @IsOptional()
  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  address: string;
}
