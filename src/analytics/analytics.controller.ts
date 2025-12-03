import { Controller, Get, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  async getAnalytics(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const data = await this.analyticsService.getAnalyticsData(
      startDate || '30daysAgo',
      endDate || 'today',
    );

    if (!data) {
      return {
        configured: false,
        message: 'Google Analytics is not configured. Please configure it in Settings.',
        data: null,
      };
    }

    return {
      configured: true,
      data,
    };
  }

  @Get('status')
  async getStatus() {
    const isConfigured = await this.analyticsService.isConfigured();
    return { configured: isConfigured };
  }

  @Get('overview')
  async getOverview(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const data = await this.analyticsService.getAnalyticsData(
      startDate || '7daysAgo',
      endDate || 'today',
    );

    if (!data) {
      return {
        configured: false,
        data: null,
      };
    }

    return {
      configured: true,
      data: data.overview,
    };
  }
}
