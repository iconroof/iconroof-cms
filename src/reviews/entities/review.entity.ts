import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  platform: string;

  @Column('text')
  comment: string;

  @Column({ type: 'decimal', precision: 2, scale: 1, default: 5 })
  rating: number;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  linkUrl: string;

  @Column({ type: 'datetime', nullable: true })
  reviewAt: Date;

  @Column({ default: 0 })
  displayOrder: number;

  @Column({ default: true })
  isApproved: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
