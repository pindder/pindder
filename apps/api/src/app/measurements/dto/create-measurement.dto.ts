// import { MeasurementTypes, Sizes } from '@pindder/contracts';
import { IsNotEmpty, IsMongoId, IsOptional, IsString, } from 'class-validator';

export class CreateMeasurementDto {
    @IsOptional()
    @IsMongoId()
    _id?: string;

    @IsString()
    owner?: string;

    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsOptional()
    description?: string;

//   @IsNotEmpty()
//   @IsEnum(MeasurementTypes)
//   measurementType!: string;

//   @IsEnum(Sizes)
//   @IsOptional()
//   size?: string;

    @IsNotEmpty()
    @IsOptional()
    // Validates that all values inside the measurements map are strings or numbers
    measurements?: Record<string, string>;

    @IsString()
    @IsOptional()
    notes?: string;
}