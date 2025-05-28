import { IsString, IsNotEmpty, IsEmail, MinLength } from "class-validator";

export class LoginDto {
  @IsEmail({}, {message: "please correct email"})
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}


