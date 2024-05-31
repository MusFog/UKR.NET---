import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { IsOptional, IsString, IsUrl } from "class-validator";

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @IsString()
  readonly name: string;
  @IsOptional()
  @IsUrl()
  imageSrc?: string;
  @IsOptional()
  @IsUrl()
  readonly description?: string;
}
