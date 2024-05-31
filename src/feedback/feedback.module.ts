import { Module } from "@nestjs/common";
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { MongooseModule } from "@nestjs/mongoose";
import { Feedback, FeedbackSchema } from "./feedback.schema";
import { UserModule } from "../user/user.module";

@Module({
  controllers: [FeedbackController],
  imports: [
    MongooseModule.forFeature([{ name: Feedback.name, schema: FeedbackSchema }]),
    UserModule
  ],
  providers: [FeedbackService],
})
export class FeedbackModule {}
