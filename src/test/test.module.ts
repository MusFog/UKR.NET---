import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { MongooseModule } from "@nestjs/mongoose";
import { Test, TestSchema } from "./test.schema";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "../middleware/passport";
import { UserModule } from "../user/user.module";

@Module({
  controllers: [TestController],
  imports: [
    MongooseModule.forFeature([{ name: Test.name, schema: TestSchema }]),
    UserModule,
    PassportModule,
  ],
  providers: [TestService, JwtStrategy],
  exports: [TestService, MongooseModule.forFeature([{ name: Test.name, schema: TestSchema }])],
})
export class TestModule {}
