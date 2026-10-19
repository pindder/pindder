import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateBankDetailDto {
    @IsNotEmpty()
    @IsString()
    bankName!: string;

    @IsNotEmpty()
    @IsString()
    accountNo!: string;

    @IsNotEmpty()
    @IsString()
    accountName!: string;

    @IsOptional()
    @IsString()
    sortCode?: string;
}
