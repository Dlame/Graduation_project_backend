import { IsInt, IsString, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class KeywordDTO {
    @IsString()
    readonly keyword: string;

    @Type(() => Number)
    @IsNotEmpty()
    @IsInt()
    readonly page: number;

    @Type(() => Number)
    @IsNotEmpty()
    @IsInt()
    size: number;
}
