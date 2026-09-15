import { IsMongoId } from "class-validator";

export class ClientAssociationDto {
    @IsMongoId()
    client!: string;

    @IsMongoId()
    tailor!: string;
}