import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { Event } from 'src/entity/event.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CloudinaryModule } from 'src/lib/cloudinary.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Event]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '0.5h' },
            }),
        }),
        CloudinaryModule, // ✅ This is the important part
    ],
    controllers: [EventController],
    providers: [EventService],
    exports: [EventService],
})
export class EventModule { }
