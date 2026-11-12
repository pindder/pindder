import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    fullname!: string;
    
    @IsOptional()
    firstname?: string;

    @IsOptional()
    lastname?: string;

    @IsOptional()
    username?: string;
    
    @IsNotEmpty()
    @IsEmail()
    email!: string;
    
    @IsNotEmpty()
    @IsString()
    countryCode!: string;
    
    @IsNotEmpty()
    @IsString()
    tel!: string;

    @IsNotEmpty()
    @IsString()
    gender!: string;
}
