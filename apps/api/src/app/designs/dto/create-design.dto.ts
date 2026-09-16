import { DesignTypes } from "@pindder/contracts";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateDesignDto {
    @IsString()
    @IsNotEmpty()
    name!: string;
    
    @IsNotEmpty()
    @IsNumber()
    amount!: number;
    
    @IsString()
    description?: string;
    
    @IsEnum(DesignTypes)
    type!: string;

    @IsArray()
    sizes?: [string];

    @IsArray()
    images?: [string];
}
