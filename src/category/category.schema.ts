import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { Document } from 'mongoose'

@Schema()
export class Category extends Document {
  @Prop({
    required: true,
    unique: true
  })
  name: string

  @Prop({
    type: String,
    default: ''
  })
  imageSrc: string

  @Prop({
    type: String,
    default: ''
  })
  description: string

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  })
  user: string
}
export const CategorySchema = SchemaFactory.createForClass(Category)



