import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('/signup')
    signup(@Body() signupdto: SignUpDto): Promise<{token : string}>{
        return this.authService.signUp(signupdto);
    }

    @Get('/login')
    login(@Body() loginDto: LoginDto): Promise<{token : string}>{
        return this.authService.login(loginDto);
    }
}
