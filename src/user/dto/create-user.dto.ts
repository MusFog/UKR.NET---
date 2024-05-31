import { IsString, IsEmail, MinLength, IsEnum } from 'class-validator';

export enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
  ADMIN = 'admin'
}

export class CreateUserDto {
  @IsString()
  readonly _id: string;
  @IsString()
  readonly login: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  @MinLength(6)
  readonly password: string;

  @IsEnum(UserRole)
  readonly role: UserRole;
}

