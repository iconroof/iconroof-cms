import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from './entities/setting.entity';
import { UpdateSettingDto, UpdateAnalyticsSettingsDto } from './dto/update-setting.dto';

@Injectable()
export class SettingsService {
  private readonly logger = new Logger(SettingsService.name);

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
    try {
      this.logger.log(`Setting key "${key}" with value length: ${value?.length || 0}`);

      let setting = await this.findByKey(key);

      if (setting) {
        setting.value = value;
        if (description) setting.description = description;
        this.logger.log(`Updating existing setting: ${key}`);
      } else {
        setting = this.settingsRepository.create({ key, value, description });
        this.logger.log(`Creating new setting: ${key}`);
      }

      const saved = await this.settingsRepository.save(setting);
      this.logger.log(`Successfully saved setting: ${key}, id: ${saved.id}`);
      return saved;
    } catch (error) {
      this.logger.error(`Failed to save setting "${key}":`, error);
      throw error;
    }
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
    this.logger.log('updateAnalyticsSettings called');
    this.logger.log(`Received gaPropertyId: ${dto.gaPropertyId ? 'yes' : 'no'}`);
    this.logger.log(`Received gaCredentials: ${dto.gaCredentials ? `yes (${dto.gaCredentials.length} chars)` : 'no'}`);

    try {
      if (dto.gaPropertyId !== undefined) {
        await this.set('ga_property_id', dto.gaPropertyId, 'Google Analytics Property ID');
      }
      if (dto.gaCredentials !== undefined && dto.gaCredentials !== '') {
        // Validate JSON before saving
        try {
          JSON.parse(dto.gaCredentials);
          this.logger.log('gaCredentials is valid JSON');
        } catch (e) {
          this.logger.error('gaCredentials is NOT valid JSON:', e);
          throw new Error('Invalid JSON format for Google Analytics credentials');
        }
        await this.set('ga_credentials', dto.gaCredentials, 'Google Analytics Service Account Credentials (JSON)');
      }
      return this.getAnalyticsSettings();
    } catch (error) {
      this.logger.error('Failed to update analytics settings:', error);
      throw error;
    }
  }

  async getGaCredentials(): Promise<object | null> {
    const credentials = await this.getValue('ga_credentials');
    this.logger.log(`getGaCredentials: found ${credentials ? `${credentials.length} chars` : 'nothing'}`);
    if (!credentials) return null;
    try {
      const parsed = JSON.parse(credentials);
      this.logger.log('getGaCredentials: successfully parsed JSON');
      return parsed;
    } catch (e) {
      this.logger.error('getGaCredentials: failed to parse JSON:', e);
      return null;
    }
  }

  async getGaPropertyId(): Promise<string | null> {
    return this.getValue('ga_property_id');
  }
}
