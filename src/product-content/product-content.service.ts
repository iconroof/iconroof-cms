import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ProductContent } from './entities/product-content.entity';
import { CreateProductContentDto } from './dto/create-product-content.dto';
import { UpdateProductContentDto } from './dto/update-product-content.dto';
import { ReorderProductContentDto } from './dto/reorder-product-content.dto';

@Injectable()
export class ProductContentService {
  constructor(
    @InjectRepository(ProductContent)
    private readonly productContentRepository: Repository<ProductContent>,
  ) {}

  async create(createDto: CreateProductContentDto): Promise<ProductContent> {
    // Get the max displayOrder for this product
    const maxOrder = await this.productContentRepository
      .createQueryBuilder('pc')
      .where('pc.productId = :productId', { productId: createDto.productId })
      .select('MAX(pc.displayOrder)', 'max')
      .getRawOne();

    const content = this.productContentRepository.create({
      ...createDto,
      displayOrder: createDto.displayOrder ?? (maxOrder?.max ?? -1) + 1,
    });

    return this.productContentRepository.save(content);
  }

  async findAll(): Promise<ProductContent[]> {
    return this.productContentRepository.find({
      order: { displayOrder: 'ASC' },
    });
  }

  async findByProductId(productId: number): Promise<ProductContent[]> {
    return this.productContentRepository.find({
      where: { productId },
      order: { displayOrder: 'ASC' },
    });
  }

  async findActiveByProductId(productId: number): Promise<ProductContent[]> {
    return this.productContentRepository.find({
      where: { productId, isActive: true },
      order: { displayOrder: 'ASC' },
    });
  }

  async findOne(id: number): Promise<ProductContent> {
    const content = await this.productContentRepository.findOne({
      where: { id },
    });

    if (!content) {
      throw new NotFoundException(`ProductContent with ID ${id} not found`);
    }

    return content;
  }

  async update(
    id: number,
    updateDto: UpdateProductContentDto,
  ): Promise<ProductContent> {
    const content = await this.findOne(id);
    Object.assign(content, updateDto);
    return this.productContentRepository.save(content);
  }

  async remove(id: number): Promise<void> {
    const content = await this.findOne(id);
    await this.productContentRepository.remove(content);
  }

  async reorder(reorderDto: ReorderProductContentDto): Promise<void> {
    const ids = reorderDto.items.map((item) => item.id);
    const contents = await this.productContentRepository.find({
      where: { id: In(ids) },
    });

    const updates = contents.map((content) => {
      const item = reorderDto.items.find((i) => i.id === content.id);
      if (item) {
        content.displayOrder = item.displayOrder;
      }
      return content;
    });

    await this.productContentRepository.save(updates);
  }

  async toggleActive(id: number): Promise<ProductContent> {
    const content = await this.findOne(id);
    content.isActive = !content.isActive;
    return this.productContentRepository.save(content);
  }

  async duplicate(id: number): Promise<ProductContent> {
    const original = await this.findOne(id);

    // Get max order for the product
    const maxOrder = await this.productContentRepository
      .createQueryBuilder('pc')
      .where('pc.productId = :productId', { productId: original.productId })
      .select('MAX(pc.displayOrder)', 'max')
      .getRawOne();

    const duplicate = this.productContentRepository.create({
      productId: original.productId,
      type: original.type,
      title: original.title ? `${original.title} (Copy)` : undefined,
      content: original.content,
      displayOrder: (maxOrder?.max ?? 0) + 1,
      isActive: original.isActive,
    });

    return this.productContentRepository.save(duplicate);
  }
}
