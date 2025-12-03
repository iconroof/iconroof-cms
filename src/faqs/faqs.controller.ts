import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { FaqsService } from './faqs.service';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';

@Controller('faqs')
export class FaqsController {
  constructor(private readonly faqsService: FaqsService) {}

  @Post()
  create(@Body() createFaqDto: CreateFaqDto) {
    return this.faqsService.create(createFaqDto);
  }

  @Get()
  findAll(
    @Query('category') category?: string,
    @Query('activeOnly') activeOnly?: string,
  ) {
    return this.faqsService.findAll(category, activeOnly === 'true');
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.faqsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFaqDto: UpdateFaqDto) {
    return this.faqsService.update(+id, updateFaqDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.faqsService.remove(+id);
  }
}
