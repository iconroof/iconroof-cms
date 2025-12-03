import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Faq } from './entities/faq.entity';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';

@Injectable()
export class FaqsService {
  constructor(
    @InjectRepository(Faq)
    private faqRepository: Repository<Faq>,
  ) {}

  async create(createFaqDto: CreateFaqDto) {
    const faq = this.faqRepository.create(createFaqDto);
    return this.faqRepository.save(faq);
  }

  async findAll(category?: string, activeOnly: boolean = false) {
    const queryBuilder = this.faqRepository.createQueryBuilder('faq');

    if (category) {
      queryBuilder.andWhere('faq.category = :category', { category });
    }

    if (activeOnly) {
      queryBuilder.andWhere('faq.isActive = :isActive', { isActive: true });
    }

    queryBuilder.orderBy('faq.displayOrder', 'ASC');

    return queryBuilder.getMany();
  }

  async findOne(id: number) {
    const faq = await this.faqRepository.findOne({ where: { id } });
    if (!faq) {
      throw new NotFoundException(`FAQ with ID ${id} not found`);
    }
    return faq;
  }

  async update(id: number, updateFaqDto: UpdateFaqDto) {
    await this.findOne(id);
    await this.faqRepository.update(id, updateFaqDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const faq = await this.findOne(id);
    return this.faqRepository.remove(faq);
  }
}
