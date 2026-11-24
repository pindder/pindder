import { IsNotEmpty, IsString } from "class-validator";

export class CreateBankDetailDto {
    @IsNotEmpty()
    @IsString()
    bank!: string;

    @IsNotEmpty()
    @IsString()
    accountNo!: string;

    @IsNotEmpty()
    @IsString()
    accountName!: string;
}
