import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ collection: 'feedbacks', timestamps: true })
export class Feedback extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({
    required: true
  })
  description: string;

  @Prop([{
    response: String,
    respondedAt: Date,
    _id: false
  }])
  adminResponses: Record<string, any>[];

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId | Record<string, any>;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
