import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFeedbackDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;
}
