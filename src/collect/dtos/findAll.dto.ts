import { IsInt, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class FindAllDTO {
    @Type(() => Number)
    @IsNotEmpty()
    @IsInt()
    page: number;

    @Type(() => Number)
    @IsNotEmpty()
    @IsInt()
    size: number;
}
