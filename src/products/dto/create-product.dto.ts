import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  Min,
  IsInt,
  IsArray,
  IsObject,
} from 'class-validator';

interface ProductColor {
  name: string;
  code: string;
  imageUrl?: string;
}

interface ProductDimensions {
  width?: string;
  height?: string;
  length?: string;
  thickness?: string;
}

export class CreateProductDto {
  @IsString()
  slug: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  imageUrl: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsString()
  brand: string;

  @IsString()
  category: string;

  @IsOptional()
  @IsObject()
  specifications?: Record<string, string>;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  highlights?: string[];

  @IsOptional()
  @IsObject()
  dimensions?: ProductDimensions;

  @IsOptional()
  @IsArray()
  colors?: ProductColor[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  relatedProducts?: string[];

  @IsOptional()
  @IsObject()
  content?: Record<string, unknown>;

  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  displayOrder?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
