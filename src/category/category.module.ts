import { forwardRef, Module } from "@nestjs/common";
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { MongooseModule } from "@nestjs/mongoose";
import { Category, CategorySchema } from "./category.schema";
import { TestModule } from "../test/test.module";
import { UserModule } from "../user/user.module";

@Module({
  controllers: [CategoryController],
  imports: [
    MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]),
    UserModule,
    forwardRef(() => TestModule),
    ],
  providers: [CategoryService],
  exports: [CategoryService, MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }])]
})
export class CategoryModule {}
