import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SlidersService } from './sliders.service';
import { SlidersController } from './sliders.controller';
import { Slider } from './entities/slider.entity';
import { SliderItem } from './entities/slider-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Slider, SliderItem])],
  controllers: [SlidersController],
  providers: [SlidersService],
  exports: [SlidersService],
})
export class SlidersModule {}
