import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from './entities/brand.entity';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
  ) {}

  async create(createBrandDto: CreateBrandDto) {
    const brand = this.brandRepository.create(createBrandDto);
    return this.brandRepository.save(brand);
  }

  async findAll(activeOnly: boolean = false) {
    const queryBuilder = this.brandRepository.createQueryBuilder('brand');

    if (activeOnly) {
      queryBuilder.andWhere('brand.isActive = :isActive', { isActive: true });
    }

    queryBuilder.orderBy('brand.displayOrder', 'ASC');

    return queryBuilder.getMany();
  }

  async findOne(id: number) {
    const brand = await this.brandRepository.findOne({ where: { id } });
    if (!brand) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }
    return brand;
  }

  async update(id: number, updateBrandDto: UpdateBrandDto) {
    await this.findOne(id);
    await this.brandRepository.update(id, updateBrandDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const brand = await this.findOne(id);
    return this.brandRepository.remove(brand);
  }
}
