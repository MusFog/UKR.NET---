import { IsOptional, IsNumberString } from 'class-validator';

export class QueryParamsDto {
  @IsOptional()
  @IsNumberString()
  offset?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;
}