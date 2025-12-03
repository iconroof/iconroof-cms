import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Slider } from './entities/slider.entity';
import { SliderItem } from './entities/slider-item.entity';
import { CreateSliderDto } from './dto/create-slider.dto';
import { UpdateSliderDto } from './dto/update-slider.dto';
import { CreateSliderItemDto } from './dto/create-slider-item.dto';
import { UpdateSliderItemDto } from './dto/update-slider-item.dto';

@Injectable()
export class SlidersService {
  constructor(
    @InjectRepository(Slider)
    private sliderRepository: Repository<Slider>,
    @InjectRepository(SliderItem)
    private sliderItemRepository: Repository<SliderItem>,
  ) {}

  // Slider methods
  async create(createSliderDto: CreateSliderDto) {
    const slider = this.sliderRepository.create(createSliderDto);
    return this.sliderRepository.save(slider);
  }

  async findAll(activeOnly: boolean = false) {
    const queryBuilder = this.sliderRepository
      .createQueryBuilder('slider')
      .leftJoinAndSelect('slider.items', 'items');

    if (activeOnly) {
      queryBuilder
        .where('slider.isActive = :isActive', { isActive: true })
        .andWhere('items.isActive = :itemActive', { itemActive: true });
    }

    queryBuilder
      .orderBy('slider.displayOrder', 'ASC')
      .addOrderBy('items.displayOrder', 'ASC');

    return queryBuilder.getMany();
  }

  async findOne(id: number) {
    const slider = await this.sliderRepository.findOne({
      where: { id },
      relations: ['items'],
    });
    if (!slider) {
      throw new NotFoundException(`Slider with ID ${id} not found`);
    }
    return slider;
  }

  async findBySlug(slug: string) {
    const slider = await this.sliderRepository.findOne({
      where: { slug },
      relations: ['items'],
    });
    if (!slider) {
      throw new NotFoundException(`Slider with slug ${slug} not found`);
    }
    return slider;
  }

  async update(id: number, updateSliderDto: UpdateSliderDto) {
    await this.findOne(id);
    await this.sliderRepository.update(id, updateSliderDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const slider = await this.findOne(id);
    return this.sliderRepository.remove(slider);
  }

  // Slider Item methods
  async createItem(createSliderItemDto: CreateSliderItemDto) {
    const slider = await this.findOne(createSliderItemDto.sliderId);
    const item = this.sliderItemRepository.create({
      ...createSliderItemDto,
      slider,
    });
    return this.sliderItemRepository.save(item);
  }

  async findAllItems(sliderId?: number) {
    const queryBuilder = this.sliderItemRepository.createQueryBuilder('item');

    if (sliderId) {
      queryBuilder.where('item.sliderId = :sliderId', { sliderId });
    }

    queryBuilder.orderBy('item.displayOrder', 'ASC');

    return queryBuilder.getMany();
  }

  async findOneItem(id: number) {
    const item = await this.sliderItemRepository.findOne({
      where: { id },
      relations: ['slider'],
    });
    if (!item) {
      throw new NotFoundException(`Slider item with ID ${id} not found`);
    }
    return item;
  }

  async updateItem(id: number, updateSliderItemDto: UpdateSliderItemDto) {
    await this.findOneItem(id);
    await this.sliderItemRepository.update(id, updateSliderItemDto);
    return this.findOneItem(id);
  }

  async removeItem(id: number) {
    const item = await this.findOneItem(id);
    return this.sliderItemRepository.remove(item);
  }
}
