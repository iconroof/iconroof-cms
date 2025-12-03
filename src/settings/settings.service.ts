import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from './entities/setting.entity';
import { UpdateSettingDto, UpdateAnalyticsSettingsDto } from './dto/update-setting.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting)
    private settingsRepository: Repository<Setting>,
  ) {}

  async findAll(): Promise<Setting[]> {
    return this.settingsRepository.find();
  }

  async findByKey(key: string): Promise<Setting | null> {
    return this.settingsRepository.findOne({ where: { key } });
  }

  async getValue(key: string): Promise<string | null> {
    const setting = await this.findByKey(key);
    return setting?.value || null;
  }

  async set(key: string, value: string, description?: string): Promise<Setting> {
    let setting = await this.findByKey(key);

    if (setting) {
      setting.value = value;
      if (description) setting.description = description;
    } else {
      setting = this.settingsRepository.create({ key, value, description });
    }

    return this.settingsRepository.save(setting);
  }

  async update(key: string, updateDto: UpdateSettingDto): Promise<Setting | null> {
    const setting = await this.findByKey(key);
    if (!setting) return null;

    setting.value = updateDto.value;
    if (updateDto.description) setting.description = updateDto.description;

    return this.settingsRepository.save(setting);
  }

  async delete(key: string): Promise<boolean> {
    const result = await this.settingsRepository.delete({ key });
    return (result.affected ?? 0) > 0;
  }

  // Analytics specific methods
  async getAnalyticsSettings() {
    const [propertyId, credentials] = await Promise.all([
      this.getValue('ga_property_id'),
      this.getValue('ga_credentials'),
    ]);

    return {
      gaPropertyId: propertyId || '',
      gaCredentials: credentials ? '***configured***' : '',
      isConfigured: !!(propertyId && credentials),
    };
  }

  async updateAnalyticsSettings(dto: UpdateAnalyticsSettingsDto) {
    if (dto.gaPropertyId !== undefined) {
      await this.set('ga_property_id', dto.gaPropertyId, 'Google Analytics Property ID');
    }
    if (dto.gaCredentials !== undefined && dto.gaCredentials !== '') {
      await this.set('ga_credentials', dto.gaCredentials, 'Google Analytics Service Account Credentials (JSON)');
    }
    return this.getAnalyticsSettings();
  }

  async getGaCredentials(): Promise<object | null> {
    const credentials = await this.getValue('ga_credentials');
    if (!credentials) return null;
    try {
      return JSON.parse(credentials);
    } catch {
      return null;
    }
  }

  async getGaPropertyId(): Promise<string | null> {
    return this.getValue('ga_property_id');
  }
}
