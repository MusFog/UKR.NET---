import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpException, HttpCode, Get, UseGuards, Query, Req, Patch, Param
} from "@nestjs/common";
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import * as bcrypt from 'bcryptjs'
import { JwtService } from '@nestjs/jwt'
import { AuthGuard } from "@nestjs/passport";

@Controller('auth')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  async login(@Body() userDto: CreateUserDto) {
    const candidate = await this.userService.findByLogin(userDto.login)

    const passwordResult = bcrypt.compareSync(
      userDto.password,
      candidate.password,
    )
    if (passwordResult) {
      const payload = { login: candidate.login, userId: candidate._id }
      const token = this.jwtService.sign(payload)
      return { token: `Bearer ${token}` }
    } else {
      throw new HttpException('Неправильний пароль', HttpStatus.UNAUTHORIZED)
    }
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: CreateUserDto) {
    await this.userService.findByRegisterLogin(createUserDto.login)

    await this.userService.findByEmail(createUserDto.email)

    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(createUserDto.password, salt)

    const newUser = await this.userService.create({
      ...createUserDto,
      password: hashedPassword,
    })

    newUser.password = undefined
    return newUser
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.userService.findAll();
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  assignRole(@Param('id') id: string, @Req() req, @Body() userDto: CreateUserDto) {
    return this.userService.assignRole(id, req.user.id, userDto.role);
  }
}
