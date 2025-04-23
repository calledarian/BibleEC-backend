import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class LoginService {
    private readonly adminUsername: string;
    private readonly adminPasswordHash: string;
    private readonly jwtSecretKey: string;
    private readonly blacklistedTokens = new Set<string>();

    private failedAttemptsByIP = new Map<string, { count: number; lastAttempt: number }>();
    private readonly MAX_ATTEMPTS = 5;
    private readonly COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes

    constructor(private configService: ConfigService) {
        const jwtSecret = this.configService.get<string>('JWT_SECRET');
        if (!jwtSecret) {
            throw new Error('JWT_SECRET is not defined in the environment variables');
        }
        this.jwtSecretKey = jwtSecret;

        const adminUsername = this.configService.get<string>('adminUsername');
        const adminPasswordHash = this.configService.get<string>('adminPasswordHash');

        if (!adminUsername || !adminPasswordHash) {
            throw new Error('Admin credentials are not defined in environment variables');
        }

        this.adminUsername = adminUsername;
        this.adminPasswordHash = adminPasswordHash;
    }

    async login(ip: string, username: string, password: string): Promise<string | { message: string } | null> {
        const now = Date.now();
        const attempt = this.failedAttemptsByIP.get(ip);

        if (attempt) {
            const timePassed = now - attempt.lastAttempt;
            if (attempt.count >= this.MAX_ATTEMPTS && timePassed < this.COOLDOWN_MS) {
                return { message: `Too many attempts. Try again in ${Math.ceil((this.COOLDOWN_MS - timePassed) / 1000)} seconds.` };
            } else if (timePassed >= this.COOLDOWN_MS) {
                this.failedAttemptsByIP.delete(ip);
            }
        }

        if (username !== this.adminUsername) {
            this.addFailedAttempt(ip, now);
            return null;
        }

        const isPasswordMatch = await bcrypt.compare(password, this.adminPasswordHash);
        if (!isPasswordMatch) {
            this.addFailedAttempt(ip, now);
            return null;
        }

        this.failedAttemptsByIP.delete(ip);

        const token = jwt.sign({ username }, this.jwtSecretKey, { expiresIn: '0.5h' });
        console.log("Log from " + ip, " Generated token expires in 30min.")
        return token;
    }

    private addFailedAttempt(ip: string, timestamp: number) {
        const prev = this.failedAttemptsByIP.get(ip);
        if (prev) {
            this.failedAttemptsByIP.set(ip, {
                count: prev.count + 1,
                lastAttempt: timestamp,
            });
        } else {
            this.failedAttemptsByIP.set(ip, {
                count: 1,
                lastAttempt: timestamp,
            });
        }
    }

    verifyToken(token: string): boolean {
        if (this.blacklistedTokens.has(token)) return false;

        try {
            jwt.verify(token, this.jwtSecretKey);
            return true;
        } catch {
            return false;
        }
    }

    logout(token: string): void {
        this.blacklistedTokens.add(token);
        console.log("User logged out, token blackliseted.")
    }

}
