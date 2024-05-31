import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UploadedFile,
  UseInterceptors, Patch, UseGuards, HttpCode, HttpStatus, Req
} from "@nestjs/common";
import { FileInterceptor } from '@nestjs/platform-express';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './category.schema';
import { multerConfig } from "../config/multer.config";
import { QueryParamsDto } from "./dto/query-params.dto";
import { AuthGuard } from "@nestjs/passport";

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get('all')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.categoryService.findAll();
  }
  @Get()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async getAll(@Query('offset') offset: string, @Query('limit') limit: string): Promise<Category[]> {
    return this.categoryService.getAll(+offset, +limit);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async getById(@Param('id') id: string): Promise<Category> {
    return this.categoryService.getById(id);
  }


  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string, @Req() req): Promise<{ message: string }> {
    await this.categoryService.delete(id, req.user.id);
    return { message: 'Категорія була видалена' };
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async create(@Req() req,
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<Category> {
    if (image) {
      createCategoryDto.imageSrc = image.path;
    }
    return this.categoryService.create(req.user.id, createCategoryDto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async update(
    @Param('id') id: string, @Req() req,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<Category> {
    if (image) {
      updateCategoryDto.imageSrc = image.path;
    }
    return this.categoryService.update(id, req.user.id, updateCategoryDto);
  }
}
