import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { DatabaseModule } from './lib/DatabaseModule';
import { EventModule } from './event/event.module';
import { LoginModule } from './login/login.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './auth/auth.guard';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_HOST: Joi.string().required(),
        DATABASE_NAME: Joi.string().required(),
        DATABASE_USER: Joi.string().required(),
        DATABASE_PASSWORD: Joi.string().required(),
        DATABASE_PORT: Joi.number().required(),
        ENVIRONMENT: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        adminUsername: Joi.string().required(),
        adminPasswordHash: Joi.string().required(),
        CLOUDINARY_CLOUD_NAME: Joi.string().required(),
        CLOUDINARY_API_KEY: Joi.string().required(),
        CLOUDINARY_API_SECRET: Joi.string().required(),

      }),
      envFilePath: '.env',
    }),
    DatabaseModule,
    EventModule,
    LoginModule,
    AuthModule, // ✅ Add this
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }