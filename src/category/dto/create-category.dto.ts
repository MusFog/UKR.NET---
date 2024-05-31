import { IsOptional, IsString, IsUrl } from "class-validator";

export class CreateCategoryDto {
  @IsString()
  readonly name: string;
  @IsOptional()
  @IsUrl()
  imageSrc?: string;
  @IsOptional()
  @IsUrl()
  readonly description?: string;
}
