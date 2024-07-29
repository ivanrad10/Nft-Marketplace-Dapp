import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class LogInDto{
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}