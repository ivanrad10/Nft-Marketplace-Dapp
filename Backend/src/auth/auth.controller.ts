import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogInDto } from 'src/users/userLogInDto.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/login')
    logIn(@Body() logInDto: LogInDto): Promise<{ token: string}> {
        return this.authService.logIn(logInDto)
    }
}
