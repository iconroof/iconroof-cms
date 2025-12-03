import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Announcement } from './entities/announcement.entity';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';

@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectRepository(Announcement)
    private announcementRepository: Repository<Announcement>,
  ) {}

  async create(createAnnouncementDto: CreateAnnouncementDto) {
    const announcement =
      this.announcementRepository.create(createAnnouncementDto);
    return this.announcementRepository.save(announcement);
  }

  async findAll(activeOnly: boolean = false) {
    const queryBuilder =
      this.announcementRepository.createQueryBuilder('announcement');

    if (activeOnly) {
      queryBuilder.andWhere('announcement.isActive = :isActive', {
        isActive: true,
      });
    }

    queryBuilder.orderBy('announcement.displayOrder', 'ASC');

    return queryBuilder.getMany();
  }

  async findOne(id: number) {
    const announcement = await this.announcementRepository.findOne({
      where: { id },
    });

    if (!announcement) {
      throw new NotFoundException(`Announcement with ID ${id} not found`);
    }

    return announcement;
  }

  async update(id: number, updateAnnouncementDto: UpdateAnnouncementDto) {
    await this.findOne(id);
    await this.announcementRepository.update(id, updateAnnouncementDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const announcement = await this.findOne(id);
    return this.announcementRepository.remove(announcement);
  }
}
