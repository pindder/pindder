import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateTailorDto {
    @IsNotEmpty()
    fullname!: string;
    
    @IsNotEmpty()
    @IsEmail()
    email!: string;

    @IsNotEmpty()
    phoneNo!: string;

    // @IsNotEmpty()
    // gender!: string;
}
