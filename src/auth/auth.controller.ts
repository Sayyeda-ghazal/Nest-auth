import { Body, Controller, Get, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { PasswordDto } from './dto/password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

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
    @Put('reset-password')
async resetPassword(@Query('token') token: string, @Body() passwordDto: PasswordDto) {
    return this.authService.resetPassword(token, passwordDto);
}

}
