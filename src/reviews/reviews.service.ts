import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {}

  async create(createReviewDto: CreateReviewDto) {
    const review = this.reviewRepository.create(createReviewDto);
    return this.reviewRepository.save(review);
  }

  async findAll(platform?: string, approvedOnly: boolean = false) {
    const queryBuilder = this.reviewRepository.createQueryBuilder('review');

    if (platform) {
      queryBuilder.andWhere('review.platform = :platform', { platform });
    }

    if (approvedOnly) {
      queryBuilder.andWhere('review.isApproved = :isApproved', { isApproved: true });
    }

    queryBuilder.orderBy('review.displayOrder', 'ASC');

    return queryBuilder.getMany();
  }

  async findOne(id: number) {
    const review = await this.reviewRepository.findOne({ where: { id } });
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    return review;
  }

  async update(id: number, updateReviewDto: UpdateReviewDto) {
    await this.findOne(id);
    await this.reviewRepository.update(id, updateReviewDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const review = await this.findOne(id);
    return this.reviewRepository.remove(review);
  }
}
