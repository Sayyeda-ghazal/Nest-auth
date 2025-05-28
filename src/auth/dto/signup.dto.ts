import { IsString, IsNotEmpty, IsEmail, MinLength } from "class-validator";

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail({}, {message: "please correct email"})
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}


