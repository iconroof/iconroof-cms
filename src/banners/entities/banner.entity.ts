import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('banners')
export class Banner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  subtitle: string;

  @Column('text', { nullable: true })
  description: string;

  @Column()
  imageUrl: string;

  @Column({ nullable: true })
  linkUrl: string;

  @Column({ nullable: true })
  linkText: string;

  @Column({ nullable: true })
  position: string; // 'home-hero', 'products-main', etc.

  @Column({ default: 0 })
  displayOrder: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
