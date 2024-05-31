import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  Req,
  UseGuards, Query, UseInterceptors
} from "@nestjs/common";
import { AnswerService } from './answer.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { AuthGuard } from "@nestjs/passport";
import { CacheInterceptor, CacheKey, CacheTTL } from "@nestjs/cache-manager";


@Controller('answer')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @Get('get/:id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  openTest(@Param('id') id: string) {
    return this.answerService.openTest(id);
  }
  @Get('rating')
  @CacheTTL(120000)
  @CacheKey('findAllRating')
  @UseInterceptors(CacheInterceptor)
  @HttpCode(HttpStatus.OK)
  findAllRating() {
    return this.answerService.findAllRating();
  }
  @Get('ratingCategory')
  @CacheTTL(120000)
  @CacheKey('findCategoryRating')
  @UseInterceptors(CacheInterceptor)
  @HttpCode(HttpStatus.OK)
  findCategoryRating() {
    return this.answerService.findCategoryRating();
  }
  @Post()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  saveTest(@Req() req, @Body() createAnswerDto: CreateAnswerDto) {
    return this.answerService.saveTest(createAnswerDto, req.user.id)
  }
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  saveAnswerMark(@Param('id') id: string, @Req() req, @Body() createAnswerDto: CreateAnswerDto) {
    return this.answerService.saveAnswerMark(id, req.user.id, createAnswerDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  findAll(@Req() req) {
    return this.answerService.findAll(req.user.id);
  }
  @Get('answerForUser')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  findAllForUser(@Req() req) {
    return this.answerService.findAllForUser(req.user.id);
  }

  @Get('answerItem/:id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string, @Req() req) {
    return this.answerService.findOne(id, req.user.id);
  }



  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.answerService.remove(+id);
  }
}
