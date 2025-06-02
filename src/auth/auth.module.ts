import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { User, UserSchema } from './schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JWTStrategy } from './jwt.strategy';
import { OtpModule } from 'src/otp/otp.module';
import { CacheModule } from '@nestjs/cache-manager';
import { EmailService } from 'src/email/email.service';
import { EmailModule } from 'src/email/email.module';
import { UserModule } from 'src/user/user.module';

@Module({
    imports:[
        CacheModule.register(),
        OtpModule,EmailModule,UserModule,
        MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
        ConfigModule.forRoot({ isGlobal: true }),
        PassportModule.register({defaultStrategy: 'jwt'}),
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (config:ConfigService) =>{
                    return {
                        secret: config.get<string>('JWT_SECRET'),
                        signOptions: {
                            expiresIn: config.get<string|number>('JWT_EXPIRES'),
                        },
                    };
                },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JWTStrategy, EmailService],
    exports: [JWTStrategy, PassportModule, EmailService],
})
export class AuthModule {}
