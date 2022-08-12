import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';


@Module({
  imports: [
    ThrottlerModule.forRoot({
        ttl: 1,
        limit: 3
    }),
  ],
  controllers: [AppController],
  providers: [AppService,
    {
        provide: APP_GUARD,
        useClass: ThrottlerModule
    }
],
})
export class AppModule {}