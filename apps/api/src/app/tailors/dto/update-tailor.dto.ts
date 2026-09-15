import { PartialType } from '@nestjs/swagger';
import { CreateTailorDto } from './create-tailor.dto';

export class UpdateTailorDto extends PartialType(CreateTailorDto) {}
