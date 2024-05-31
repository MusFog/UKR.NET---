import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from './user.schema'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: "dev-jwt",
      signOptions: { expiresIn: '60m' },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  exports: [PassportModule, UserService, MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
})
export class UserModule {}
