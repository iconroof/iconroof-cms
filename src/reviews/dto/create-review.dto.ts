import { IsString, IsOptional, IsNumber, IsBoolean, IsDateString } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  platform?: string;

  @IsString()
  comment: string;

  @IsNumber()
  @IsOptional()
  rating?: number;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  linkUrl?: string;

  @IsDateString()
  @IsOptional()
  reviewAt?: string;

  @IsNumber()
  @IsOptional()
  displayOrder?: number;

  @IsBoolean()
  @IsOptional()
  isApproved?: boolean;
}
