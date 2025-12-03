import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BannersModule } from './banners/banners.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { PromotionsModule } from './promotions/promotions.module';
import { ProductsModule } from './products/products.module';
import { UploadModule } from './upload/upload.module';
import { BrandsModule } from './brands/brands.module';
import { FaqsModule } from './faqs/faqs.module';
import { ArticlesModule } from './articles/articles.module';
import { ReviewsModule } from './reviews/reviews.module';
import { SlidersModule } from './sliders/sliders.module';
import { SettingsModule } from './settings/settings.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { ProductContentModule } from './product-content/product-content.module';
import { Banner } from './banners/entities/banner.entity';
import { Setting } from './settings/entities/setting.entity';
import { Product } from './products/entities/product.entity';
import { Announcement } from './announcements/entities/announcement.entity';
import { Promotion } from './promotions/entities/promotion.entity';
import { Brand } from './brands/entities/brand.entity';
import { Faq } from './faqs/entities/faq.entity';
import { Article } from './articles/entities/article.entity';
import { Review } from './reviews/entities/review.entity';
import { Slider } from './sliders/entities/slider.entity';
import { SliderItem } from './sliders/entities/slider-item.entity';
import { ProductContent } from './product-content/entities/product-content.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 3306),
        username: configService.get('DB_USERNAME', 'root'),
        password: configService.get('DB_PASSWORD', ''),
        database: configService.get('DB_DATABASE', 'iconroof_cms'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') !== 'production',
        // Connection pooling for better performance
        extra: {
          connectionLimit: 10,
        },
        // Keep connections alive
        keepConnectionAlive: true,
      }),
    }),
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [{
        rootPath: configService.get('UPLOAD_PATH', join(process.cwd(), 'uploads')),
        serveRoot: '/uploads',
      }],
    }),
    BannersModule,
    AnnouncementsModule,
    PromotionsModule,
    ProductsModule,
    UploadModule,
    BrandsModule,
    FaqsModule,
    ArticlesModule,
    ReviewsModule,
    SlidersModule,
    SettingsModule,
    AnalyticsModule,
    ProductContentModule,
    // For dashboard stats
    TypeOrmModule.forFeature([
      Banner,
      Product,
      Announcement,
      Promotion,
      Brand,
      Faq,
      Article,
      Review,
      Slider,
      SliderItem,
      Setting,
      ProductContent,
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
