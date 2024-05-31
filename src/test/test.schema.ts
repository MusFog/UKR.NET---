import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema()
export class Test extends Document {
  @Prop({
    type: Date,
    default: Date.now
  })
  date: Date;

  @Prop({
    required: true
  })
  name: string;

  @Prop({
    required: true
  })
  mark: number;

  @Prop({
    required: true
  })
  description: string;

  @Prop([{
    question: {
      type: String,
      required: true },
    answer: {
      type: String,
      required: true
    }
  }])
  item: Record<string, any>[];

  @Prop([{
    comments: [{
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }],
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true
    },
    answerComments: [{
      text: { type: String, required: true },
      answeredAt: { type: Date, default: Date.now },
      answeredBy: {
        type: Types.ObjectId,
        ref: "User"
      },
    }],
  }])
  comment: Record<string, any>[];

  @Prop({
    type: Types.ObjectId,
    ref: "Category"
  })
  category: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: "User"
  })
  user: Types.ObjectId;
}

export const TestSchema = SchemaFactory.createForClass(Test);
