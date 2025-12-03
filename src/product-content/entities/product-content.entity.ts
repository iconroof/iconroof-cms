import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';

// Block type enum for different content components
export enum ContentBlockType {
  SLIDER = 'slider',
  VIDEO = 'video',
  VIDEO_CAROUSEL = 'video_carousel',
  IMAGE_GALLERY = 'image_gallery',
  TEXT = 'text',
  FEATURES = 'features',
  SPECIFICATIONS = 'specifications',
  COMPARISON = 'comparison',
  CTA = 'cta',
  DIVIDER = 'divider',
  ACCORDION = 'accordion',
  TABS = 'tabs',
}

// Content interfaces for each block type
export interface SliderContent {
  images: Array<{
    url: string;
    alt?: string;
    caption?: string;
    linkUrl?: string;
  }>;
  autoplay?: boolean;
  interval?: number;
  showDots?: boolean;
  showArrows?: boolean;
}

export interface VideoContent {
  type: 'youtube' | 'vimeo' | 'self_hosted';
  url: string;
  thumbnailUrl?: string;
  title?: string;
  autoplay?: boolean;
  muted?: boolean;
}

export interface ContentCarouselSlide {
  type: 'image' | 'video' | 'text';
  imageUrl?: string;
  alt?: string;
  videoUrl?: string;
  videoType?: 'youtube' | 'vimeo' | 'self_hosted';
  thumbnailUrl?: string;
  title?: string;
  description?: string;
  backgroundColor?: string;
  caption?: string;
}

export interface ContentCarouselContent {
  slides: ContentCarouselSlide[];
}

export interface ImageGalleryContent {
  images: Array<{
    url: string;
    alt?: string;
    caption?: string;
  }>;
  columns?: number;
  lightbox?: boolean;
}

export interface TextContent {
  html: string;
  alignment?: 'left' | 'center' | 'right';
}

export interface FeaturesContent {
  title?: string;
  items: Array<{
    icon?: string;
    title: string;
    description?: string;
  }>;
  columns?: number;
}

export interface SpecificationsContent {
  title?: string;
  items: Array<{
    label: string;
    value: string;
  }>;
}

export interface ComparisonContent {
  title?: string;
  headers: string[];
  rows: Array<{
    label: string;
    values: string[];
  }>;
}

export interface CTAContent {
  title?: string;
  description?: string;
  buttonText: string;
  buttonUrl: string;
  buttonStyle?: 'primary' | 'secondary' | 'outline';
  backgroundColor?: string;
}

export interface DividerContent {
  style?: 'solid' | 'dashed' | 'dotted';
  spacing?: 'small' | 'medium' | 'large';
}

export interface AccordionContent {
  items: Array<{
    title: string;
    content: string;
    defaultOpen?: boolean;
  }>;
}

export interface TabsContent {
  tabs: Array<{
    title: string;
    content: string;
    icon?: string;
  }>;
}

export type BlockContent =
  | SliderContent
  | VideoContent
  | ContentCarouselContent
  | ImageGalleryContent
  | TextContent
  | FeaturesContent
  | SpecificationsContent
  | ComparisonContent
  | CTAContent
  | DividerContent
  | AccordionContent
  | TabsContent;

@Entity('product_contents')
export class ProductContent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: number;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({
    type: 'enum',
    enum: ContentBlockType,
  })
  type: ContentBlockType;

  @Column({ nullable: true })
  title: string;

  @Column('json')
  content: BlockContent;

  @Column({ default: 0 })
  displayOrder: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
