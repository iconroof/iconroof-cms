import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateSettingDto, UpdateAnalyticsSettingsDto } from './dto/update-setting.dto';

@Controller('settings')
export class SettingsController {
  private readonly logger = new Logger(SettingsController.name);

  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  findAll() {
    return this.settingsService.findAll();
  }

  @Get('analytics')
  getAnalyticsSettings() {
    return this.settingsService.getAnalyticsSettings();
  }

  @Get('analytics/debug')
  async debugAnalyticsSettings() {
    this.logger.log('GET /settings/analytics/debug called');
    const allSettings = await this.settingsService.findAll();
    const gaSettings = allSettings.filter(s => s.key.startsWith('ga_'));
    return {
      totalSettings: allSettings.length,
      gaSettingsCount: gaSettings.length,
      gaSettings: gaSettings.map(s => ({
        key: s.key,
        valueLength: s.value?.length || 0,
        updatedAt: s.updatedAt,
      })),
    };
  }

  @Patch('analytics')
  updateAnalyticsSettings(@Body() dto: UpdateAnalyticsSettingsDto) {
    this.logger.log('PATCH /settings/analytics called');
    this.logger.log(`Body keys: ${Object.keys(dto).join(', ')}`);
    return this.settingsService.updateAnalyticsSettings(dto);
  }

  @Get(':key')
  findOne(@Param('key') key: string) {
    return this.settingsService.findByKey(key);
  }

  @Patch(':key')
  update(@Param('key') key: string, @Body() updateDto: UpdateSettingDto) {
    return this.settingsService.update(key, updateDto);
  }

  @Delete(':key')
  remove(@Param('key') key: string) {
    return this.settingsService.delete(key);
  }
}
