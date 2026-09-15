import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
    firstname?: string;
    lastname?: string;
    username?: string;
    
    @IsNotEmpty()
    @IsEmail()
    email!: string;
    phoneNo!: string;
}
