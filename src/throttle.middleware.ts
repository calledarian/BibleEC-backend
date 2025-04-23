// throttle.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

const ipAttempts: Record<string, { count: number; lastTry: number }> = {};

@Injectable()
export class ThrottleMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const ip = req.ip || (req.headers['x-forwarded-for'] as string) || 'unknown';
        const now = Date.now();
        const record = ipAttempts[ip] || { count: 0, lastTry: now };

        if (now - record.lastTry > 60_000) {
            record.count = 1;
            record.lastTry = now;
        } else {
            record.count += 1;
        }

        ipAttempts[ip] = record;

        if (record.count > 10) {
            return res.status(429).json({ message: 'Too many login attempts. Try again later.' });
        }

        console.log(`IP: ${ip}, Attempts: ${record.count}`);

        next();
    }
}
