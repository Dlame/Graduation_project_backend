import { IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class FindAllDTO {
    @Type(() => Number)
    @IsInt()
    page: number;

    @Type(() => Number)
    @IsInt()
    size: number;
}
