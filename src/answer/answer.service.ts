import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { CreateAnswerDto } from './dto/create-answer.dto';
import { InjectModel } from "@nestjs/mongoose";
import { Answer } from "./answer.schema";
import { Model } from "mongoose";
import { Test } from "../test/test.schema";
import { User, UserRole } from "../user/user.schema";
import { UserService } from "../user/user.service";
import { Category } from "../category/category.schema";
import { EmailService } from '../answer/sendEmailToSubscribers.service';
@Injectable()
export class AnswerService {
  constructor(@InjectModel(Test.name) private testModel: Model<Test>, private emailService: EmailService, @InjectModel(User.name) private userModel: Model<User>, @InjectModel(Category.name) private categoryModel: Model<Category>, @InjectModel(Answer.name) private answerModel: Model<Answer>, private readonly userService: UserService) {}
  async openTest(id: string): Promise<Test> {
    return this.testModel.findOne({ _id: id }).exec();
  }
  async saveTest(createAnswerDto: CreateAnswerDto, userId): Promise<Answer> {
    const newAnswer = new this.answerModel({
      ...createAnswerDto,
      user: userId,
    });
    return newAnswer.save();
  }

  async findAll(userId: string): Promise<Answer[]> {
    const user = await this.userService.findById(userId);
    if (user.roles !== UserRole.TEACHER) {
      throw new UnauthorizedException('Переглядати відповіді студентів, мають право лише викладачі');
    }
    const result = await this.answerModel.find().exec();
    return result;
  }
  async findAllRating(): Promise<any> {
    const answers = await this.answerModel.find({ answerChecked: true }).exec();
    const userMarks: Record<string, { sumPercentages: number, count: number }> = {};
    for (const answer of answers) {
      const userId = answer.user.toString();
      if (!userMarks[userId]) {
        userMarks[userId] = { sumPercentages: 0, count: 0 };
      }
      const test = await this.testModel.findById(answer.testId).exec();
      if (!test) {
        continue;
      }
      const answerPercentage = (answer.mark / test.mark) * 100;
      userMarks[userId].sumPercentages += answerPercentage;
      userMarks[userId].count++;
    }

    const ratings = Object.keys(userMarks).map(userId => {
      const { sumPercentages, count } = userMarks[userId];
      const averagePercentage = parseFloat((sumPercentages / count).toFixed(2));
      const normalizedMark = convertPercentageTo12PointScale(averagePercentage);
      function convertPercentageTo12PointScale(percentage) {
        return Math.round((percentage / 100) * 12);
      }

      return {
        userId,
        averagePercentage,
        normalizedMark
      };
    });
    ratings.sort((a, b) => b.normalizedMark - a.normalizedMark);
    const topFive = ratings.slice(0, 5);
    const userDetails = await this.userModel.find({
      '_id': { $in: topFive.map(user => user.userId) }
    }).exec();
    const results = topFive.map(user => ({
      ...user,
      userDetails: userDetails.find(detail => detail._id.toString() === user.userId)
    }));
    return results;
  }

  async findCategoryRating(): Promise<any> {
    const answers = await this.answerModel.find({ answerChecked: true }).exec();
    const categoryMarks: Record<string, { sum: number, count: number, totalPossibleMarks: number }> = {};
    for (const answer of answers) {
      const test = await this.testModel.findById(answer.testId).exec();
      if (!test) {
        continue;
      }
      const categoryId = test.category.toString();
      if (!categoryMarks[categoryId]) {
        categoryMarks[categoryId] = { sum: 0, count: 0, totalPossibleMarks: 0 };
      }
      const answerPercentage = (answer.mark / test.mark) * 100;
      categoryMarks[categoryId].sum += answerPercentage;
      categoryMarks[categoryId].totalPossibleMarks += 100;
      categoryMarks[categoryId].count++;
    }
    const categoryAverages = Object.keys(categoryMarks).map(categoryId => {
      const { sum, count } = categoryMarks[categoryId];
      const averagePercentage = sum / count;
      const normalizedMark = convertPercentageTo12PointScale(averagePercentage);
      function convertPercentageTo12PointScale(percentage) {
        return Math.round((percentage / 100) * 12);
      }

      return {
        categoryId,
        averageMark: normalizedMark
      };
    });
    categoryAverages.sort((a, b) => b.averageMark - a.averageMark);
    const topThreeCategories = categoryAverages.slice(0, 3);
    const categoriesDetails = await this.categoryModel.find({
      '_id': { $in: topThreeCategories.map(category => category.categoryId) }
    }).exec();
    const results = topThreeCategories.map(category => {
      const categoryDetails = categoriesDetails.find(detail => detail._id.toString() === category.categoryId);
      return {
        ...category,
        categoryDetails
      };
    });
    return results;
  }


  async findAllForUser(userId: string): Promise<Answer[]> {
    const filter: any = { user: userId };
    const result = await this.answerModel.find(filter).exec();
    return result;
  }


  async saveAnswerMark(id: string, userId: string, createAnswerDto: CreateAnswerDto) {
    const user = await this.userService.findById(userId);
    if (user.roles !== UserRole.TEACHER) {
      throw new UnauthorizedException('Оцінити відповіді студента мають право лише викладачі');
    }

    const updatedAnswer = await this.answerModel
      .findByIdAndUpdate(id, createAnswerDto, { new: true }).exec();
    if (!updatedAnswer) {
      throw new HttpException('Відповіді студента не знайдено', HttpStatus.NOT_FOUND);
    }

    const student = await this.userService.findById(updatedAnswer.user.toString());
    if (student) {
      this.emailService.sendEmailToStudent(student.email, updatedAnswer.mark, updatedAnswer.name);
    }
  }



  async findOne(id: string, userId: string): Promise<Answer> {
    const user = await this.userService.findById(userId);
    const answer = await this.answerModel.findOne({ _id: id }).exec();

    if (user.roles !== UserRole.TEACHER && answer.user.toString() !== userId) {
      throw new UnauthorizedException('Переглядати відповіді студента, мають право лише викладачі або автори тесту');
    }

    return answer;
  }



  remove(id: number) {
    return `This action removes a #${id} answer`;
  }
}
