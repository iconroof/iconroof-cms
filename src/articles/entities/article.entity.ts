import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('articles')
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  slug: string;

  @Column({ nullable: true })
  category: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('text', { nullable: true })
  content: string;

  // Editor.js rich content JSON
  @Column('json', { nullable: true })
  richContent: Record<string, unknown>;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  linkUrl: string;

  @Column({ nullable: true })
  author: string;

  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  @Column({ default: 0 })
  displayOrder: number;

  @Column({ default: true })
  isPublished: boolean;

  @Column({ type: 'datetime', nullable: true })
  publishedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
