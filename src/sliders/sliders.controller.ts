import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SlidersService } from './sliders.service';
import { CreateSliderDto } from './dto/create-slider.dto';
import { UpdateSliderDto } from './dto/update-slider.dto';
import { CreateSliderItemDto } from './dto/create-slider-item.dto';
import { UpdateSliderItemDto } from './dto/update-slider-item.dto';

@Controller('sliders')
export class SlidersController {
  constructor(private readonly slidersService: SlidersService) {}

  // Slider endpoints
  @Post()
  create(@Body() createSliderDto: CreateSliderDto) {
    return this.slidersService.create(createSliderDto);
  }

  @Get()
  findAll(@Query('activeOnly') activeOnly?: string) {
    return this.slidersService.findAll(activeOnly === 'true');
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.slidersService.findOne(+id);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.slidersService.findBySlug(slug);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSliderDto: UpdateSliderDto) {
    return this.slidersService.update(+id, updateSliderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.slidersService.remove(+id);
  }

  // Slider Item endpoints
  @Post('items')
  createItem(@Body() createSliderItemDto: CreateSliderItemDto) {
    return this.slidersService.createItem(createSliderItemDto);
  }

  @Get('items/all')
  findAllItems(@Query('sliderId') sliderId?: string) {
    return this.slidersService.findAllItems(sliderId ? +sliderId : undefined);
  }

  @Get('items/:id')
  findOneItem(@Param('id') id: string) {
    return this.slidersService.findOneItem(+id);
  }

  @Patch('items/:id')
  updateItem(@Param('id') id: string, @Body() updateSliderItemDto: UpdateSliderItemDto) {
    return this.slidersService.updateItem(+id, updateSliderItemDto);
  }

  @Delete('items/:id')
  removeItem(@Param('id') id: string) {
    return this.slidersService.removeItem(+id);
  }
}
