import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Banner } from './banners/entities/banner.entity';
import { Product } from './products/entities/product.entity';
import { Announcement } from './announcements/entities/announcement.entity';
import { Promotion } from './promotions/entities/promotion.entity';
import { Brand } from './brands/entities/brand.entity';
import { Faq } from './faqs/entities/faq.entity';
import { Article } from './articles/entities/article.entity';
import { Review } from './reviews/entities/review.entity';
import { Slider } from './sliders/entities/slider.entity';

export interface DashboardStats {
  banners: number;
  products: number;
  announcements: number;
  promotions: number;
  brands: number;
  faqs: number;
  articles: number;
  reviews: number;
  sliders: number;
}

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Banner)
    private bannerRepository: Repository<Banner>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Announcement)
    private announcementRepository: Repository<Announcement>,
    @InjectRepository(Promotion)
    private promotionRepository: Repository<Promotion>,
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
    @InjectRepository(Faq)
    private faqRepository: Repository<Faq>,
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(Slider)
    private sliderRepository: Repository<Slider>,
  ) {}

  getHello(): string {
    return 'Iconroof CMS API';
  }

  async getDashboardStats(): Promise<DashboardStats> {
    // Run all count queries in parallel for better performance
    const [banners, products, announcements, promotions, brands, faqs, articles, reviews, sliders] =
      await Promise.all([
        this.bannerRepository.count(),
        this.productRepository.count(),
        this.announcementRepository.count(),
        this.promotionRepository.count(),
        this.brandRepository.count(),
        this.faqRepository.count(),
        this.articleRepository.count(),
        this.reviewRepository.count(),
        this.sliderRepository.count(),
      ]);

    return {
      banners,
      products,
      announcements,
      promotions,
      brands,
      faqs,
      articles,
      reviews,
      sliders,
    };
  }
}
