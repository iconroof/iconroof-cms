import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Banner } from './entities/banner.entity';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';

@Injectable()
export class BannersService {
  constructor(
    @InjectRepository(Banner)
    private bannerRepository: Repository<Banner>,
  ) {}

  async create(createBannerDto: CreateBannerDto) {
    const banner = this.bannerRepository.create(createBannerDto);
    return this.bannerRepository.save(banner);
  }

  async findAll(position?: string, activeOnly: boolean = false) {
    const queryBuilder = this.bannerRepository.createQueryBuilder('banner');

    if (position) {
      queryBuilder.andWhere('banner.position = :position', { position });
    }

    if (activeOnly) {
      queryBuilder.andWhere('banner.isActive = :isActive', { isActive: true });
    }

    queryBuilder.orderBy('banner.displayOrder', 'ASC');

    return queryBuilder.getMany();
  }

  async findOne(id: number) {
    const banner = await this.bannerRepository.findOne({
      where: { id },
    });

    if (!banner) {
      throw new NotFoundException(`Banner with ID ${id} not found`);
    }

    return banner;
  }

  async findByPosition(position: string) {
    return this.bannerRepository.findOne({
      where: { position, isActive: true },
      order: { displayOrder: 'ASC' },
    });
  }

  async update(id: number, updateBannerDto: UpdateBannerDto) {
    await this.findOne(id);
    await this.bannerRepository.update(id, updateBannerDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const banner = await this.findOne(id);
    return this.bannerRepository.remove(banner);
  }
}
