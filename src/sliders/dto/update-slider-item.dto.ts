import { PartialType } from '@nestjs/mapped-types';
import { CreateSliderItemDto } from './create-slider-item.dto';

export class UpdateSliderItemDto extends PartialType(CreateSliderItemDto) {}
