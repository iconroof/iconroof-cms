import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsBoolean,
  IsObject,
} from 'class-validator';
import { ContentBlockType } from '../entities/product-content.entity';
import type { BlockContent } from '../entities/product-content.entity';

export class CreateProductContentDto {
  @IsNumber()
  productId: number;

  @IsEnum(ContentBlockType)
  type: ContentBlockType;

  @IsOptional()
  @IsString()
  title?: string;

  @IsObject()
  content: Record<string, unknown>;

  @IsOptional()
  @IsNumber()
  displayOrder?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
