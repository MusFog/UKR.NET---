import { Module } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { AnswerController } from './answer.controller';
import { MongooseModule } from "@nestjs/mongoose";
import { Answer, AnswerSchema } from "./answer.schema";
import { TestModule } from "../test/test.module";
import { UserModule } from "../user/user.module";
import { CategoryModule } from "../category/category.module";
import { AppModule } from "../app.module";
import { EmailService } from "./sendEmailToSubscribers.service";


@Module({
  controllers: [AnswerController],
  providers: [AnswerService, EmailService],
  imports: [
    MongooseModule.forFeature([{ name: Answer.name, schema: AnswerSchema }]),
    UserModule,
    CategoryModule,
    TestModule
  ],
  exports: [AnswerService, MongooseModule.forFeature([{ name: Answer.name, schema: AnswerSchema }])],
})
export class AnswerModule {}
