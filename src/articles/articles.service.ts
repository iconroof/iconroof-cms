import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './entities/article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}

  async create(createArticleDto: CreateArticleDto) {
    const article = this.articleRepository.create(createArticleDto);
    return this.articleRepository.save(article);
  }

  async findAll(category?: string, publishedOnly: boolean = false) {
    const queryBuilder = this.articleRepository.createQueryBuilder('article');

    if (category) {
      queryBuilder.andWhere('article.category = :category', { category });
    }

    if (publishedOnly) {
      queryBuilder.andWhere('article.isPublished = :isPublished', { isPublished: true });
    }

    queryBuilder.orderBy('article.displayOrder', 'ASC');

    return queryBuilder.getMany();
  }

  async findOne(id: number) {
    const article = await this.articleRepository.findOne({ where: { id } });
    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }
    return article;
  }

  async findBySlug(slug: string) {
    const article = await this.articleRepository.findOne({ where: { slug } });
    if (!article) {
      throw new NotFoundException(`Article with slug ${slug} not found`);
    }
    return article;
  }

  async update(id: number, updateArticleDto: UpdateArticleDto) {
    const article = await this.findOne(id);
    // Merge the DTO into the article entity to handle JSON fields properly
    const updatedArticle = this.articleRepository.merge(article, updateArticleDto as Partial<Article>);
    return this.articleRepository.save(updatedArticle);
  }

  async remove(id: number) {
    const article = await this.findOne(id);
    return this.articleRepository.remove(article);
  }
}
