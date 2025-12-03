import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateSettingDto, UpdateAnalyticsSettingsDto } from './dto/update-setting.dto';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  findAll() {
    return this.settingsService.findAll();
  }

  @Get('analytics')
  getAnalyticsSettings() {
    return this.settingsService.getAnalyticsSettings();
  }

  @Patch('analytics')
  updateAnalyticsSettings(@Body() dto: UpdateAnalyticsSettingsDto) {
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
