import { IsEnum, IsNotEmpty, IsString, ValidateIf } from "class-validator";
import { PasswordAction } from "../enums/password-action.enum";

export class PasswordDto{
    @IsEnum(PasswordAction)
    action:PasswordAction

    @ValidateIf(o => o.action === PasswordAction.CHANGE)
    @IsNotEmpty({message: 'Current Password Required'})
    @IsString()
    currentpassword: string

    @ValidateIf(o => o.action === PasswordAction.CHANGE || o.action === PasswordAction.RESET)
    @IsString()
    newpassword: string

    @ValidateIf(o => o.action === PasswordAction.RESET)
    @IsString()
    forgotpassword: string

    @ValidateIf(o => o.action === PasswordAction.RESET)
    @IsString()
    resettoken: string

    @ValidateIf(o => o.action === PasswordAction.FORGOT)
    @IsString()
    email: string
}