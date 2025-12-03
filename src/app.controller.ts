import { Controller, Get } from '@nestjs/common';
import { AppService, DashboardStats } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('dashboard/stats')
  async getDashboardStats(): Promise<DashboardStats> {
    return this.appService.getDashboardStats();
  }
}
