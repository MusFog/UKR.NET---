import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Feedback } from './feedback.schema';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UserRole } from "../user/user.schema";
import { UserService } from "../user/user.service";

@Injectable()
export class FeedbackService {
  constructor(@InjectModel(Feedback.name) private feedbackModel: Model<Feedback>, private readonly userService: UserService) {}
  async create(createFeedbackDto: CreateFeedbackDto, userId: string): Promise<Feedback> {
    const newFeedback = new this.feedbackModel({
      ...createFeedbackDto,
      user: userId,
    });
    return newFeedback.save();
  }
  async findAll(): Promise<Feedback[]> {
    return this.feedbackModel.find().populate('user', 'login').exec();
  }


  async findById(id: string): Promise<Feedback> {
    const feedback = await this.feedbackModel.findById(id).exec();
    if (!feedback) {
      throw new NotFoundException(`Відгук з ідентифікатором "${id}" не знайдено`);
    }
    console.log(feedback)
    return feedback;
  }

  async updateById(id: string, userId, adminResponse: string): Promise<Feedback> {
    const user = await this.userService.findById(userId);
    if (user.roles !== UserRole.TEACHER) {
      throw new UnauthorizedException('Відправити відгук від адміністратора, мають право лише викладачі або адміністратори');
    }
    const updatedFeedback = await this.feedbackModel.findByIdAndUpdate(
      id,
      { $push: { adminResponses: { response: adminResponse, respondedAt: new Date() } } },
      { new: true },
    );
    if (!updatedFeedback) {
      throw new NotFoundException(`Відгук з ідентифікатором "${id}" не знайдено`);
    }
    return updatedFeedback;
  }
}
