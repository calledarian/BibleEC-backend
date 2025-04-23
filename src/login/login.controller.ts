import {
    Controller,
    Post,
    Body,
    UnauthorizedException,
    Res,
    Headers,
    Get,
    Req,
} from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginDto } from 'src/dto/login.dto';
import { Response, Request } from 'express';

@Controller('auth')
export class LoginController {
    constructor(private readonly loginService: LoginService) { }

    @Post('login')
    async login(
        @Req() req: Request,
        @Body() loginDto: LoginDto,
        @Res() res: Response,
    ): Promise<any> {
        const { username, password } = loginDto;

        const ipRaw =
            req.ip ||
            (req.headers['x-forwarded-for'] as string | undefined) ||
            req.connection.remoteAddress ||
            'unknown';

        const ip = Array.isArray(ipRaw) ? ipRaw[0] : ipRaw;

        const token = await this.loginService.login(ip, username, password);

        if (!token) {
            throw new UnauthorizedException('Invalid credentials or too many attempts. Try again later.');
        }

        return res.json({ token });
    }

    @Get('check')
    checkAuth(@Headers('authorization') auth: string) {
        if (!auth?.startsWith('Bearer ')) throw new UnauthorizedException();
        const token = auth.split(' ')[1];

        const isValid = this.loginService.verifyToken(token);
        if (!isValid) throw new UnauthorizedException();

        return { message: 'You are authenticated' };
    }

    @Post('logout')
    logout(@Headers('authorization') auth: string) {
        if (!auth?.startsWith('Bearer ')) throw new UnauthorizedException();
        const token = auth.split(' ')[1];
        this.loginService.logout(token);
        return { message: 'Logged out successfully' };
    }
}
