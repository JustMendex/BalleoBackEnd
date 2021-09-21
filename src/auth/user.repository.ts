import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SignUpDto } from './dto/sign-up.dto';
import * as bcrypt from 'bcryptjs';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { User, UserDocument } from './user.schema';
import { SignInDto } from './dto/sign-in.dto';

export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async signUp(signUpDto: SignUpDto): Promise<User> {
    const { firstName, lastName, email, displayName, password } = signUpDto;

    const user = new this.userModel();
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.displayName = displayName;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);

    try {
      await user.save();
      return user;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Email already exist');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUserPassword(signInDto: SignInDto): Promise<User> {
    const { email, password } = signInDto;

    const user = await this.userModel.findOne({ email });
    if (
      user &&
      (await this.validatePassword(password, user.salt, user.password))
    ) {
      return user;
    }
    return null;
  }

  async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async validatePassword(
    password: string,
    salt: string,
    userPassword: string,
  ): Promise<boolean> {
    const hash = await bcrypt.hash(password, salt);

    return hash === userPassword;
  }
}
