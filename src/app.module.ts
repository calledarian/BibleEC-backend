import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomConfigModule } from './config/config.module';
import { DatabaseModule } from './lib/DatabaseModule';
import { EventModule } from './event/event.module';
import { LoginModule } from './login/login.module';
import { AuthModule } from './auth/auth.module';
import { ThrottlerConfig } from './throttler.config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [
    CustomConfigModule,
    DatabaseModule,
    EventModule,
    LoginModule,
    ThrottlerConfig,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule { }
