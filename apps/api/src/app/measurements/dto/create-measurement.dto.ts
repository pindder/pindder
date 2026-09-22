// import { MeasurementTypes, Sizes } from '@pindder/contracts';
import { IsNotEmpty, IsObject, IsMongoId, IsOptional, IsString, } from 'class-validator';

export class CreateMeasurementDto {
    @IsOptional()
    @IsMongoId()
    _id?: string;

    @IsOptional()
    @IsMongoId()
    client?: string; 

    @IsMongoId()
    @IsOptional()
    user?: string;

//   @IsNotEmpty()
//   @IsEnum(MeasurementTypes)
//   measurementType!: string;

//   @IsEnum(Sizes)
//   @IsOptional()
//   size?: string;

    @IsObject()
    @IsNotEmpty()
    @IsOptional()
    // Validates that all values inside the measurements map are strings or numbers
    measurements?: Record<string, string>;

    @IsString()
    @IsOptional()
    notes?: string;
}