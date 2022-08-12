import { Controller, ExecutionContext, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ThrottlerBehindProxyGuard, WsThrottlerGuard } from './rateLimiting';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  
  @UseGuards(WsThrottlerGuard)
  @Get('howold')
  async getAge( @Query() query: { dob: string }){
      return "here";
      return this.appService.getAgeByDate(query.dob);      
  }
}