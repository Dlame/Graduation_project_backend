import { IsInt, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class BooksDTO {
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  readonly page: number;

  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  size: number;
}
