import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { RateLimit } from 'nestjs-rate-limiter'
import { ThrottlerBehindProxyGuard } from './rateLimiting';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  
  @UseGuards(ThrottlerBehindProxyGuard)
  @Get('howold')
  async getAge(@Query() query: { dob: string }){
      return this.appService.getAgeByDate(query.dob);      
  }
}