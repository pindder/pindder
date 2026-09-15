import { DesignTypes, Sizes } from "@pindder/contracts";
import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateDesignDto {
    @IsString()
    @IsNotEmpty()
    designName!: string;
    
    @IsNotEmpty()
    @IsNumber()
    amount!: number;
    
    @IsString()
    description?: string;
    
    @IsEnum(DesignTypes)
    type!: string;

    @IsEnum(Sizes)
    sizes?: [string];
}
