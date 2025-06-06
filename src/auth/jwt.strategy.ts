import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { User } from "./schemas/user.schema";
import { Model } from "mongoose";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy){
    constructor(
        private configService: ConfigService,
        @InjectModel(User.name)
        private userModel: Model<User>
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get<string>('JWT_SECRET') || 'default_jwt_secret',
          });
    }

    async validate(payload){
        const {id} = payload;
        const user = await this.userModel.findById(id);

        if(!user){
            throw new UnauthorizedException('Login first to access this endpoint.')
        }
        return user;
    }
}