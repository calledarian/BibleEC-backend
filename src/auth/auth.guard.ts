import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private configService: ConfigService) { }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers['authorization'];

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('Authorization header missing or invalid');
            return false;
        }

        const token = authHeader.split(' ')[1];
        try {
            const jwtSecret = this.configService.get<string>('JWT_SECRET');
            if (!jwtSecret) {
                throw new Error('JWT_SECRET is not defined in the configuration');
            }
            const decoded = jwt.verify(token, jwtSecret);
            request.user = decoded;
            return true;
        } catch (e) {
            console.log('Token verification failed:', e.message);
            return false;
        }
    }
}
