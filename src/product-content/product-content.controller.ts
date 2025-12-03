import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ProductContentService } from './product-content.service';
import { CreateProductContentDto } from './dto/create-product-content.dto';
import { UpdateProductContentDto } from './dto/update-product-content.dto';
import { ReorderProductContentDto } from './dto/reorder-product-content.dto';

@Controller('product-content')
export class ProductContentController {
  constructor(private readonly productContentService: ProductContentService) {}

  @Post()
  create(@Body() createDto: CreateProductContentDto) {
    return this.productContentService.create(createDto);
  }

  @Get()
  findAll(@Query('productId') productId?: string) {
    if (productId) {
      return this.productContentService.findByProductId(parseInt(productId, 10));
    }
    return this.productContentService.findAll();
  }

  @Get('product/:productId')
  findByProduct(@Param('productId', ParseIntPipe) productId: number) {
    return this.productContentService.findByProductId(productId);
  }

  @Get('product/:productId/active')
  findActiveByProduct(@Param('productId', ParseIntPipe) productId: number) {
    return this.productContentService.findActiveByProductId(productId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productContentService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateProductContentDto,
  ) {
    return this.productContentService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productContentService.remove(id);
  }

  @Post('reorder')
  reorder(@Body() reorderDto: ReorderProductContentDto) {
    return this.productContentService.reorder(reorderDto);
  }

  @Patch(':id/toggle-active')
  toggleActive(@Param('id', ParseIntPipe) id: number) {
    return this.productContentService.toggleActive(id);
  }

  @Post(':id/duplicate')
  duplicate(@Param('id', ParseIntPipe) id: number) {
    return this.productContentService.duplicate(id);
  }
}
