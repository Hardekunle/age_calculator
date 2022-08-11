import { BadRequestException, Controller, Get, Param, Query } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { Console } from 'console';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @SkipThrottle(true)
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('howold')
  getAge(@Query() query: { dob: string }){
      return this.appService.getAgeByDate(query.dob);      
  }
}