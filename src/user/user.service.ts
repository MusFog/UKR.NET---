import { Injectable, HttpStatus, HttpException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User, UserRole } from "./user.schema";
import { CreateUserDto } from './dto/create-user.dto'

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async findById(userId: string): Promise<User | undefined> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException(`Користувача з ідентифікатором "${userId}" не знайдено`
      );
    }
    return user;
  }
  async assignRole(Id: string, userId: string, role: UserRole): Promise<User> {
    const userRole = await this.userModel.findById(userId);
      if (userRole.roles !== UserRole.ADMIN) {
        throw new UnauthorizedException('Призначати ролі користувачам мають право лише адміністратори');
      }
    const updateData = { roles: role };
    const user = await this.userModel.findByIdAndUpdate(Id, updateData, { new: true }).exec();
    if (!user) {
      throw new NotFoundException(`Користувача з ідентифікатором "${Id}" не знайдено`);
    }
    return user;
  }
  async findAll() {
    const user = await this.userModel.find()
    if (!user) {
      throw new NotFoundException(`Користувачів не знайдено`
      );
    }
    return user;
  }
  async findByLogin(login: string): Promise<User | undefined> {
    const user = await this.userModel.findOne({ login }).exec()
    if (!user) {
      throw new HttpException(
        'Користувача з таким логіном не знайдено',
        HttpStatus.NOT_FOUND,
      )
    }
    return user
  }
  async findByRegisterLogin(login: string): Promise<void> {
    const user = await this.userModel.findOne({ login }).exec()
    if (user) {
      throw new HttpException(
        'Користувач з таким логіном вже існує',
        HttpStatus.BAD_REQUEST,
      )
    }
  }

  async findByEmail(email: string): Promise<void> {
    const user = await this.userModel.findOne({ email }).exec()
    if (user) {
      throw new HttpException(
        'Така електронна адреса вже використовується',
        HttpStatus.BAD_REQUEST,
      )
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = new this.userModel(createUserDto)
    return newUser.save()
  }
}
