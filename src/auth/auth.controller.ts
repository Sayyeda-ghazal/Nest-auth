import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { PasswordDto } from './dto/password.dto';

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

    @Post('request-password-reset')
async requestPasswordReset(@Body('email') email: string) {
  return this.authService.requestPasswordReset(email);
}

    @Put('reset-password')
    async resetPassword(@Body() passwordDto: PasswordDto) {
        return this.authService.resetPassword( passwordDto.otp, passwordDto);
}
}
