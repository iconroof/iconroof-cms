import { IsArray, IsNumber, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

class ContentOrderItem {
  @IsNumber()
  id: number;

  @IsNumber()
  displayOrder: number;
}

export class ReorderProductContentDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ContentOrderItem)
  items: ContentOrderItem[];
}
