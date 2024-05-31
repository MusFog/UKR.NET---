import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException
} from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Test } from './test.schema';
import { CreateTestDto} from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { AddCommentDto } from './dto/add-comment.dto';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { User, UserRole } from "../user/user.schema";
import { UserService } from "../user/user.service";


@Injectable()
export class TestService {
  constructor(@InjectModel(Test.name) private readonly testModel: Model<Test>,
              @InjectModel(User.name) private readonly userModel: Model<User>,
              private readonly userService: UserService,
              @Inject(CACHE_MANAGER) private cacheManager: Cache) {}


  async findAll(query: any): Promise<Test[]> {
    const filter: any = {};
    if (query.categoryId) {
      const categoryIds = Array.isArray(query.categoryId) ? query.categoryId : [query.categoryId];
      filter.category = { $in: categoryIds };
    }
    if (query.test) {
      filter.test = +query.test;
    }
    const result = await this.testModel.find(filter)
      .skip(+query.offset)
      .limit(+query.limit )
      .exec();
    return result;
  }
  async findIdAll(categoryId: string) {
    return await this.testModel.find({ category: categoryId }).exec();
  }



  async findById(id: string, userId: string): Promise<Test> {
    const parts = id.split('-');
    if (parts.length === 4 && parts[0] === 'user' && parts[2] === 'test') {
      const userPrefix = parts[1];
      const testPrefix = parts[3];
      const test = await this.testModel.findById(testPrefix)
        .populate({
          path: 'comment',
          populate: [
            {
              path: 'createdBy',
              select: 'login'
            },
            {
              path: 'answerComments.answeredBy',
              select: 'login'
            }
          ]
        })
        .populate('user', 'login')
        .exec();

      if (!test) {
        throw new NotFoundException(`Тест з ідентифікатором "${testPrefix}" не знайдено`);
      }

      if (test.comment && test.comment.length) {
        test.comment = test.comment.filter(c => c.createdBy && c.createdBy._id.toString() === userPrefix);
      }

      return test;
    } else {
      const test = await this.testModel.findById(id)
        .populate({
          path: 'comment',
          populate: [
            {
              path: 'createdBy',
              select: 'login'
            },
            {
              path: 'answerComments.answeredBy',
              select: 'login'
            }
          ]
        })
        .populate('user', 'login')
        .exec();

      if (!test) {
        throw new NotFoundException(`Тест з ідентифікатором "${id}" не знайдено`);
      }

      if (test.comment && test.comment.length) {
        test.comment = test.comment.filter(c => c.createdBy && c.createdBy._id.toString() === userId);
      }
      return test;
    }
  }

  async findAllUserFeedback(Id: string): Promise<any[]> {

    const test = await this.testModel.findById(Id).populate('comment.createdBy').exec();
    if (!test) {
      throw new NotFoundException(`Тест з ідентифікатором "${Id}" не знайдено`);
    }

    const userFeedbacks = new Set();
    test.comment.forEach(comment => {
      if (comment.createdBy) {
        userFeedbacks.add(comment.createdBy._id.toString());
      }
    });

    if (userFeedbacks.size === 0) {
      return [];
    }

    const users = await this.userModel.find({
      '_id': { $in: Array.from(userFeedbacks) }
    }).select('_id login');

    const result = users.map(user => ({
      _id: user._id,
      login: user.login
    }));
    return result;
  }





  async create(createTestDto: CreateTestDto, userId: string): Promise<Test> {
    const user = await this.userService.findById(userId);
    try {
      if (user.roles !== UserRole.TEACHER) {
        throw new UnauthorizedException('Створювати тести мають право лише викладачі');
      }
      const newTest = new this.testModel({
        ...createTestDto,
        user: userId,
      });
      const savedTest = await newTest.save();
      return savedTest;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async update(id: string, userId: string, updateTestDto: UpdateTestDto): Promise<Test> {
    const user = await this.userService.findById(userId);
      if (user.roles !== UserRole.TEACHER) {
        throw new UnauthorizedException('Оновлювати тести мають право лише викладачі');
      }
    const updatedTest = await this.testModel.findByIdAndUpdate(id, updateTestDto, { new: true }).exec();
    if (!updatedTest) {
      throw new NotFoundException(`Новини з ідентифікатором "${id}" не знайдено`);
    }
    return updatedTest;
  }

  async delete(id: string, userId: string): Promise<void> {
    const user = await this.userService.findById(userId);
    if (user.roles !== UserRole.TEACHER) {
      throw new UnauthorizedException('Видаляти тести мають право лише викладачі');
    }
    const result = await this.testModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Новини з ідентифікатором "${id}" не знайдено`);
    }
  }

  async addComment(id: string, userId: string, addCommentDto: AddCommentDto): Promise<Test> {
    const parts = id.split('-');

    if (parts.length !== 4 || parts[0] !== 'user' || parts[2] !== 'test') {
      const test = await this.testModel.findById(id).exec();
      if (!test) {
        throw new NotFoundException(`Тест з ідентифікатором "${id}" не знайдено`);
      }

      const comment = {
        text: addCommentDto.text,
        createdAt: new Date()
      };

      if (!test.comment) {
        test.comment = [{
          createdBy: userId,
          comments: [comment]
        }];
      } else {
        const userComment = test.comment.find(c => c.createdBy.toString() === userId.toString());
        if (userComment) {
          userComment.comments.push(comment);
        } else {
          test.comment.push({
            createdBy: userId,
            comments: [comment]
          });
        }
      }
      await test.save();
      return test;
    } else {
      const userPrefix = parts[1];
      const testPrefix = parts[3];
      const test = await this.testModel.findById(testPrefix).exec();
      if (!test) {
        throw new NotFoundException(`Тест з ідентифікатором "${testPrefix}" не знайдено`);
      }

      const userComment = test.comment.find(c => c.createdBy.toString() === userPrefix);
      if (!userComment) {
        throw new NotFoundException(`Коментар від користувача з ID "${userPrefix}" не знайдено`);
      }

      const adminComment = {
        text: addCommentDto.text,
        answeredAt: new Date(),
        answeredBy: userId
      };

      if (!userComment.answerComments) {
        userComment.answerComments = [adminComment];
      } else {

        userComment.answerComments.push(adminComment);
      }

      await test.save();
      return test;

    }
  }

}
