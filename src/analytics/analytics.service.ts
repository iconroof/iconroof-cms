import { Injectable, Logger } from '@nestjs/common';
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { SettingsService } from '../settings/settings.service';

export interface AnalyticsData {
  overview: {
    totalUsers: number;
    newUsers: number;
    sessions: number;
    pageViews: number;
    avgSessionDuration: number;
    bounceRate: number;
  };
  dailyStats: Array<{
    date: string;
    users: number;
    sessions: number;
    pageViews: number;
  }>;
  topPages: Array<{
    pagePath: string;
    pageTitle: string;
    pageViews: number;
    uniqueViews: number;
  }>;
  trafficSources: Array<{
    source: string;
    medium: string;
    users: number;
    sessions: number;
  }>;
  deviceCategories: Array<{
    deviceCategory: string;
    users: number;
    sessions: number;
  }>;
  countries: Array<{
    country: string;
    users: number;
    sessions: number;
  }>;
}

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(private readonly settingsService: SettingsService) {}

  private async getClient(): Promise<BetaAnalyticsDataClient | null> {
    const credentials = await this.settingsService.getGaCredentials();
    if (!credentials) {
      this.logger.warn('Google Analytics credentials not configured');
      return null;
    }

    return new BetaAnalyticsDataClient({
      credentials: credentials as any,
    });
  }

  async getAnalyticsData(startDate: string = '30daysAgo', endDate: string = 'today'): Promise<AnalyticsData | null> {
    const client = await this.getClient();
    const propertyId = await this.settingsService.getGaPropertyId();

    if (!client || !propertyId) {
      return null;
    }

    try {
      const [overview, dailyStats, topPages, trafficSources, devices, countries] = await Promise.all([
        this.getOverview(client, propertyId, startDate, endDate),
        this.getDailyStats(client, propertyId, startDate, endDate),
        this.getTopPages(client, propertyId, startDate, endDate),
        this.getTrafficSources(client, propertyId, startDate, endDate),
        this.getDeviceCategories(client, propertyId, startDate, endDate),
        this.getCountries(client, propertyId, startDate, endDate),
      ]);

      return {
        overview,
        dailyStats,
        topPages,
        trafficSources,
        deviceCategories: devices,
        countries,
      };
    } catch (error) {
      this.logger.error('Failed to fetch analytics data', error);
      throw error;
    }
  }

  private async getOverview(
    client: BetaAnalyticsDataClient,
    propertyId: string,
    startDate: string,
    endDate: string,
  ) {
    const [response] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate, endDate }],
      metrics: [
        { name: 'totalUsers' },
        { name: 'newUsers' },
        { name: 'sessions' },
        { name: 'screenPageViews' },
        { name: 'averageSessionDuration' },
        { name: 'bounceRate' },
      ],
    });

    const row = response.rows?.[0];
    return {
      totalUsers: parseInt(row?.metricValues?.[0]?.value || '0'),
      newUsers: parseInt(row?.metricValues?.[1]?.value || '0'),
      sessions: parseInt(row?.metricValues?.[2]?.value || '0'),
      pageViews: parseInt(row?.metricValues?.[3]?.value || '0'),
      avgSessionDuration: parseFloat(row?.metricValues?.[4]?.value || '0'),
      bounceRate: parseFloat(row?.metricValues?.[5]?.value || '0'),
    };
  }

  private async getDailyStats(
    client: BetaAnalyticsDataClient,
    propertyId: string,
    startDate: string,
    endDate: string,
  ) {
    const [response] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'date' }],
      metrics: [
        { name: 'totalUsers' },
        { name: 'sessions' },
        { name: 'screenPageViews' },
      ],
      orderBys: [{ dimension: { dimensionName: 'date' } }],
    });

    return (response.rows || []).map((row) => ({
      date: row.dimensionValues?.[0]?.value || '',
      users: parseInt(row.metricValues?.[0]?.value || '0'),
      sessions: parseInt(row.metricValues?.[1]?.value || '0'),
      pageViews: parseInt(row.metricValues?.[2]?.value || '0'),
    }));
  }

  private async getTopPages(
    client: BetaAnalyticsDataClient,
    propertyId: string,
    startDate: string,
    endDate: string,
  ) {
    const [response] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'pagePath' }, { name: 'pageTitle' }],
      metrics: [
        { name: 'screenPageViews' },
        { name: 'totalUsers' },
      ],
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit: 10,
    });

    return (response.rows || []).map((row) => ({
      pagePath: row.dimensionValues?.[0]?.value || '',
      pageTitle: row.dimensionValues?.[1]?.value || '',
      pageViews: parseInt(row.metricValues?.[0]?.value || '0'),
      uniqueViews: parseInt(row.metricValues?.[1]?.value || '0'),
    }));
  }

  private async getTrafficSources(
    client: BetaAnalyticsDataClient,
    propertyId: string,
    startDate: string,
    endDate: string,
  ) {
    const [response] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'sessionSource' }, { name: 'sessionMedium' }],
      metrics: [
        { name: 'totalUsers' },
        { name: 'sessions' },
      ],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 10,
    });

    return (response.rows || []).map((row) => ({
      source: row.dimensionValues?.[0]?.value || '',
      medium: row.dimensionValues?.[1]?.value || '',
      users: parseInt(row.metricValues?.[0]?.value || '0'),
      sessions: parseInt(row.metricValues?.[1]?.value || '0'),
    }));
  }

  private async getDeviceCategories(
    client: BetaAnalyticsDataClient,
    propertyId: string,
    startDate: string,
    endDate: string,
  ) {
    const [response] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'deviceCategory' }],
      metrics: [
        { name: 'totalUsers' },
        { name: 'sessions' },
      ],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    });

    return (response.rows || []).map((row) => ({
      deviceCategory: row.dimensionValues?.[0]?.value || '',
      users: parseInt(row.metricValues?.[0]?.value || '0'),
      sessions: parseInt(row.metricValues?.[1]?.value || '0'),
    }));
  }

  private async getCountries(
    client: BetaAnalyticsDataClient,
    propertyId: string,
    startDate: string,
    endDate: string,
  ) {
    const [response] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'country' }],
      metrics: [
        { name: 'totalUsers' },
        { name: 'sessions' },
      ],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 10,
    });

    return (response.rows || []).map((row) => ({
      country: row.dimensionValues?.[0]?.value || '',
      users: parseInt(row.metricValues?.[0]?.value || '0'),
      sessions: parseInt(row.metricValues?.[1]?.value || '0'),
    }));
  }

  async isConfigured(): Promise<boolean> {
    const [credentials, propertyId] = await Promise.all([
      this.settingsService.getGaCredentials(),
      this.settingsService.getGaPropertyId(),
    ]);
    return !!(credentials && propertyId);
  }
}
