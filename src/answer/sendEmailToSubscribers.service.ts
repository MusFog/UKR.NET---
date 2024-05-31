import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Answer } from '../answer/answer.schema';
import { User } from '../user/user.schema';

@Injectable()
export class EmailService {
  constructor(
    @InjectModel(Answer.name) private answerModel: Model<Answer>,
    @InjectModel(User.name) private userModel: Model<User>
  ) {}

  async sendEmailToStudent(email: string, mark: number, name: string) {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "full84132@gmail.com",
        pass: "olad vpwy nhwz zthh",
      },
    });

    try {
      await transporter.sendMail({
        from: '"UKR.TEST" <your-email@gmail.com>',
        to: email,
        subject: `Результати перевірки вашого тесту ${name}`,
        text: `Ваш тест був перевірений. Ваша оцінка: ${mark}`,
      });
    } catch (error) {
      console.error('Помилка при відправленні листів: ', error);
    }
  }
}
