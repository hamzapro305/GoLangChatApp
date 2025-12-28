import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class CreateUserDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsOptional()
    @IsString()
    profilePic?: string;
}

export class ValidateUserDto {
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}

export class UpdateNameDto {
    @IsString()
    name: string;
}

export class UpdatePasswordDto {
    @IsString()
    @MinLength(6)
    password: string;
}
