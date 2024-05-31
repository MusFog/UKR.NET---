import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
  ADMIN = 'admin'
}

@Schema({ collection: 'users' })
export class User extends Document {
  @Prop({
    required: true,
    unique: true
  })
  login: string;

  @Prop({
    required: true,
    unique: true
  })
  email: string;

  @Prop({
    required: true
  })
  password: string;

  @Prop({
    required: true,
    enum: UserRole,
    default: UserRole.STUDENT
  })
  roles: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
