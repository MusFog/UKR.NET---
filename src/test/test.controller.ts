import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Delete,
  Put,
  Req,
  UseGuards, HttpStatus, HttpCode
} from "@nestjs/common";
import { TestService } from './test.service';
import { CreateTestDto} from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { AddCommentDto } from './dto/add-comment.dto';
import { Test } from "./test.schema";
import { AuthGuard } from "@nestjs/passport";

@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}
  @Get()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  findAll(@Query() query) {
    return this.testService.findAll(query);
  }

  @Get('all/:id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  findIdAll(@Param('id') categoryId: string) {
    return this.testService.findIdAll(categoryId);
  }
  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  findById(@Param('id') id: string, @Req() req): Promise<Test> {
    return this.testService.findById(id, req.user.id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  create(@Req() req, @Body() createTestDto: CreateTestDto) {
    return this.testService.create(createTestDto, req.user.id);
  }
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string, @Req() req,): Promise<void> {
    return this.testService.delete(id, req.user.id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Req() req, @Body() updateTestDto: UpdateTestDto): Promise<Test> {
    return this.testService.update(id, req.user.id, updateTestDto);
  }
  @Get('userFeedback/:id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  findAllUserFeedback(@Param('id') id: string) {
    return this.testService.findAllUserFeedback(id);
  }
  @Post('comment/:id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  addComment(@Param('id') id: string, @Body() addCommentDto: AddCommentDto, @Req() req): Promise<Test> {
    return this.testService.addComment(id, req.user._id, addCommentDto);
  }
}
