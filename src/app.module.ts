import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { WsThrottlerGuard } from './rateLimiting';
import { RateLimiterGuard, RateLimiterModule } from 'nestjs-rate-limiter'


@Module({
  imports: [RateLimiterModule],
  //   ThrottlerModule.forRoot({
  //       ttl: 1,
  //       limit: 3 
  //   })
  // ],
  controllers: [AppController],
  providers: [AppService,
    {
        provide: APP_GUARD,
        useClass: RateLimiterGuard
    }
],
})
export class AppModule {}