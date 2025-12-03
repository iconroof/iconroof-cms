import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Promotion } from './entities/promotion.entity';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';

@Injectable()
export class PromotionsService {
  constructor(
    @InjectRepository(Promotion)
    private promotionRepository: Repository<Promotion>,
  ) {}

  async create(createPromotionDto: CreatePromotionDto) {
    const data: any = { ...createPromotionDto };
    if (createPromotionDto.startDate) {
      data.startDate = new Date(createPromotionDto.startDate);
    }
    if (createPromotionDto.endDate) {
      data.endDate = new Date(createPromotionDto.endDate);
    }
    const promotion = this.promotionRepository.create(data);
    return this.promotionRepository.save(promotion);
  }

  async findAll(activeOnly: boolean = false, currentOnly: boolean = false) {
    const queryBuilder =
      this.promotionRepository.createQueryBuilder('promotion');

    if (activeOnly) {
      queryBuilder.andWhere('promotion.isActive = :isActive', {
        isActive: true,
      });
    }

    if (currentOnly) {
      const now = new Date();
      queryBuilder.andWhere(
        '(promotion.startDate IS NULL OR promotion.startDate <= :now)',
        { now },
      );
      queryBuilder.andWhere(
        '(promotion.endDate IS NULL OR promotion.endDate >= :now)',
        { now },
      );
    }

    queryBuilder.orderBy('promotion.displayOrder', 'ASC');

    return queryBuilder.getMany();
  }

  async findOne(id: number) {
    const promotion = await this.promotionRepository.findOne({
      where: { id },
    });

    if (!promotion) {
      throw new NotFoundException(`Promotion with ID ${id} not found`);
    }

    return promotion;
  }

  async update(id: number, updatePromotionDto: UpdatePromotionDto) {
    await this.findOne(id);

    const dto = updatePromotionDto as any;
    const data: any = { ...updatePromotionDto };
    if (dto.startDate) {
      data.startDate = new Date(dto.startDate);
    }
    if (dto.endDate) {
      data.endDate = new Date(dto.endDate);
    }

    await this.promotionRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    const promotion = await this.findOne(id);
    return this.promotionRepository.remove(promotion);
  }
}
