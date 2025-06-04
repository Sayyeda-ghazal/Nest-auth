import { IsNotEmpty, IsString } from "class-validator";

export class PostsDto{

    @IsNotEmpty()
    @IsString()
    title: string;
    
    @IsString()
    @IsNotEmpty()
    content: string;

}