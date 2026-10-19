import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateTailorDto {
    @IsNotEmpty()
    @IsString()
    fullname!: string;
    
    @IsNotEmpty()
    @IsEmail()
    email!: string;

    @IsNotEmpty()
    @IsString()
    countryCode!: string;

    @IsNotEmpty()
    @IsString()
    tel!: string;

    @IsString()
    @IsOptional()
    referral?: string;
}
