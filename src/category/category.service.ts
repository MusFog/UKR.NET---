import { Injectable, HttpException, HttpStatus, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Test } from "../test/test.schema";
import { QueryParamsDto } from "./dto/query-params.dto";
import { UserRole } from "../user/user.schema";
import { UserService } from "../user/user.service";

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    private readonly userService: UserService,
    @InjectModel(Test.name) private newsModel: Model<Test>,
  ) {}

  async getAll(offset: number, limit: number): Promise<Category[]> {
    return this.categoryModel
      .find()
      .skip(offset)
      .limit(limit);
  }

  async getById(id: string): Promise<Category> {
    const category = await this.categoryModel.findById(id);
    if (!category) {
      throw new HttpException('Категорія не знайдена', HttpStatus.NOT_FOUND);
    }
    return category;
  }

  async delete(id: string, userId: string): Promise<void> {
    const user = await this.userService.findById(userId);
    if (user.roles !== UserRole.TEACHER) {
      throw new UnauthorizedException('Видаляти категорї мають право лише викладачі');
    }
    const deleteResult = await this.categoryModel.deleteOne({ _id: id });
    if (deleteResult.deletedCount === 0) {
      throw new HttpException('Категорія не знайдена', HttpStatus.NOT_FOUND);
    }
    await this.newsModel.deleteMany({ category: id });
  }

  async create(userId: string, createCategoryDto: CreateCategoryDto): Promise<Category> {
    const user = await this.userService.findById(userId);
    if (user.roles !== UserRole.TEACHER) {
      throw new UnauthorizedException('Створювати категорї мають право лише викладачі');
    }
    const newCategory = new this.categoryModel(createCategoryDto);
    return newCategory.save();
  }

  async update(id: string, userId: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const user = await this.userService.findById(userId);
    if (user.roles !== UserRole.TEACHER) {
      throw new UnauthorizedException('Оновлювати категорї мають право лише викладачі');
    }
    const updatedCategory = await this.categoryModel
      .findByIdAndUpdate(id, updateCategoryDto, { new: true });
    if (!updatedCategory) {
      throw new HttpException('Категорія не знайдена', HttpStatus.NOT_FOUND);
    }
    return updatedCategory;
  }
  async findAll() {
    const category = await this.categoryModel.find()
    return category
  }
}
