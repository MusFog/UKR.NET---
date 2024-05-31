import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './user/user.module'
import { MongooseModule } from '@nestjs/mongoose'
import { CategoryModule } from './category/category.module';
import { TestModule } from './test/test.module';
import { FeedbackModule } from './feedback/feedback.module';
import { CacheModule } from "@nestjs/cache-manager";
import { CacheInterceptor } from "@nestjs/cache-manager";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { AnswerModule } from './answer/answer.module';

const keys = require("./config/keys")
@Module({
  imports: [
    MongooseModule.forRoot(keys.mongoURI),
    UserModule,
    CategoryModule,
    TestModule,
    CacheModule.register( {
      isGlobal: true
    }),
    FeedbackModule,
    AnswerModule,
  ],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_INTERCEPTOR,
    useClass: CacheInterceptor,
  }],
})

export class AppModule {}
