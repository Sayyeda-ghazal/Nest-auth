import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CACHE_MANAGER} from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';

import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { PasswordDto } from './dto/password.dto';
import { PasswordAction } from './enums/password-action.enum';
import { OtpService } from 'src/otp/otp.service';
import { EmailService } from 'src/email/email.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        @InjectModel(User.name)
        private userModel: Model<User>,
        private jwtService: JwtService,
        private userService: UserService,
        private readonly otpService: OtpService,
        private readonly emailService: EmailService,
    ){}

    async signUp(signupDto: SignUpDto): Promise<{ token: string}>{
        const{name, email, password} = signupDto;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user= await this.userModel.create({
            name, 
            email, 
            password: hashedPassword
        });

        const token = this.jwtService.sign({id: user._id});
        return {token}
    }

    async login(loginDto: LoginDto): Promise<{token: string}>{
        const{email, password} = loginDto;

        const user =await this.userModel.findOne({ email});

        if(!user){
            throw new UnauthorizedException("Invalid Email and Password");
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if(!isPasswordMatched){
            throw new UnauthorizedException("Invalid Password.");
        }
        const token = this.jwtService.sign({id: user._id});
        return {token}
    }

    async PasswordAuth(userId,passwordDto: PasswordDto ){
        const {action} = passwordDto;
        if (action === PasswordAction.CHANGE){
            const user = await this.userModel.findById(userId);
            if(!user){
                throw new UnauthorizedException("User not Found");
            }
            const isPasswordMatched = await bcrypt.compare(passwordDto.currentpassword, user.password);
            if(!isPasswordMatched){
                throw new UnauthorizedException('Invalid Password');
            }

            const hashedPassword = await bcrypt.hash(passwordDto.newpassword, 10);
            user.password = hashedPassword;
            await user.save()
            }  
        else if (action === PasswordAction.FORGOT){
            const otp = await this.otpService.generateOtp()
            await this.emailService.sendemail({
                recipients: [passwordDto.email],
                subject: 'Your OTP Code',
                html: `<p>Your OTP code is: <strong>${otp}</strong></p>`,
              });
          
              return { message: 'OTP sent to email' };
        }
        else if (action === PasswordAction.RESET) {
       
            const user = await this.userModel.findOne({ email: passwordDto.forgotpassword });
            if (!user) {
              throw new UnauthorizedException("User not found");
            }
        
         
            const storedOtp = await this.cacheManager.get(passwordDto.forgotpassword);
            if (storedOtp !== passwordDto.resettoken) {
              throw new UnauthorizedException("Invalid or expired OTP");
            }
        
            // STEP 3: Hash and update
            const hashedPassword = await bcrypt.hash(passwordDto.newpassword, 10);
            user.password = hashedPassword;
            await user.save();
        
            await this.cacheManager.del(passwordDto.forgotpassword);
        
            return { message: 'Password reset successfully' };
          }
    }

    async resetPassword( otp: string, passwordDto: PasswordDto) {
        const user = await this.userService.findByEmail(passwordDto.email);
        if (!user) {
          throw new NotFoundException('User not found');
        }
      
        if (!user.resetOtp || user.resetOtp !== otp) {
          throw new BadRequestException('Invalid reset OTP');
        }
      
        if (!user.resetOtpExpiry || user.resetOtpExpiry < new Date()) {
          throw new BadRequestException('Reset OTP expired');
        }
      
        const hashed = await bcrypt.hash(passwordDto.newpassword, 10);
        user.password = hashed;
      
        user.resetOtp = undefined;
        user.resetOtpExpiry = undefined;
      
        await this.userService.save(user);
        return { message: 'Password updated successfully' };
      }
      
    
    async requestPasswordReset(email: string) {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new NotFoundException('User not found');
        }
    
        const otp = this.otpService.generateOtp(6);
        console.log(otp)
    
        user.resetOtp = otp;
        user.resetOtpExpiry = new Date(Date.now() + 15 * 60 * 1000); 
        await this.userService.save(user);
    
        await this.emailService.sendPasswordResetEmail(user.email, otp);
    
        return { message: 'Password reset OTP sent to your email' };
    }
    
      
}
