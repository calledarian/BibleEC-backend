import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

export const CustomConfigModule = ConfigModule.forRoot({
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
});
