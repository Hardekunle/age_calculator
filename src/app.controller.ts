import { BadRequestException, Controller, Get, Param, Query } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { Console } from 'console';
import { AppService } from './app.service';
import { WsThrottlerGuard } from './rateLimiting';
import { RateLimit, RateLimiterGuard } from 'nestjs-rate-limiter'

//@SkipThrottle(true)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  //@SkipThrottle(true)
  getHello(): string {
    return this.appService.getHello();
  }

  
  @RateLimit({
    keyPrefix: 'getAge',
    points: 3,
    duration: 60,
    customResponseSchema: () => { return { message: 'Too many request' }}
  })
  @Get('howold')
  async getAge(@Query() query: { dob: string }){
      return this.appService.getAgeByDate(query.dob);      
  }
}