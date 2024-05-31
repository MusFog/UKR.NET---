import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema()
export class Answer extends Document {

  @Prop({
    required: true
  })
  name: string

  @Prop([{
    itemId: { type: Types.ObjectId, required: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    correct: { type: Boolean, required: false }
  }])
  answers: Record<string, any>[];
  @Prop({
    required: true
  })
  answerChecked: Boolean;

  @Prop({
    required: false
  })
  mark: number;

  @Prop({
    type: Types.ObjectId,
    ref: "Test"
  })
  category: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: "User"
  })
  user: Types.ObjectId;
  @Prop({
    type: Types.ObjectId,
    ref: "Test"
  })
  testId: Types.ObjectId;

  @Prop({
    type: Date,
    default: Date.now
  })
  createdAt: Date;
}

export const AnswerSchema = SchemaFactory.createForClass(Answer);
