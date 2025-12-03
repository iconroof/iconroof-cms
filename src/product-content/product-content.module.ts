import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductContent } from './entities/product-content.entity';
import { ProductContentService } from './product-content.service';
import { ProductContentController } from './product-content.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProductContent])],
  controllers: [ProductContentController],
  providers: [ProductContentService],
  exports: [ProductContentService],
})
export class ProductContentModule {}
