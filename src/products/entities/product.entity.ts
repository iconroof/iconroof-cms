import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

interface ProductColor {
  name: string;
  code: string;
  imageUrl?: string;
}

interface ProductDimensions {
  width?: string;
  height?: string;
  length?: string;
  thickness?: string;
}

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  slug: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column()
  imageUrl: string;

  @Column('simple-array', { nullable: true })
  images: string[];

  @Column()
  brand: string;

  @Column()
  category: string;

  @Column('json', { nullable: true })
  specifications: Record<string, string>;

  @Column('simple-array', { nullable: true })
  features: string[];

  @Column('simple-array', { nullable: true })
  highlights: string[];

  @Column('json', { nullable: true })
  dimensions: ProductDimensions;

  @Column('json', { nullable: true })
  colors: ProductColor[];

  @Column('simple-array', { nullable: true })
  relatedProducts: string[];

  // Editor.js content JSON
  @Column('json', { nullable: true })
  content: Record<string, unknown>;

  @Column({ default: 0 })
  stock: number;

  @Column({ default: 0 })
  displayOrder: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
