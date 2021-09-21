import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { JwtPayload } from './jwt-payload.interface';
import { SignInAndSignUpResponsePyaload } from './signin-and-signup-response-payload.interface';
import { UserRepository } from './user.repository';
import { User, UserDocument } from './user.schema';
import { AccessAndRefreshTokenPyaload } from './access-and-refresh-token.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  //User Sign up Function
  async signUp(signUpDto: SignUpDto): Promise<SignInAndSignUpResponsePyaload> {
    //Creates the user account
    const user = await this.userRepository.signUp(signUpDto);

    //Creates the access and refresh tokens for the user
    const payload: JwtPayload = { email: user.email };
    const tokens: AccessAndRefreshTokenPyaload =
      await this.createAcessAndRefreshToken(payload);

    const responseData: SignInAndSignUpResponsePyaload = {
      firstName: user.firstName,
      lastName: user.lastName,
      displayName: user.displayName,
      email: user.email,
      userType: user.userType,
      balance: user.balance,
      rib: user.rib,
      address: user.address,
      phoneNumber: user.phoneNumber,
      city: user.city,
      zipCode: user.zipCode,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
    return responseData;
  }

  //User Sign in Function
  async signIn(signInDto: SignInDto): Promise<SignInAndSignUpResponsePyaload> {
    //Validating the user password
    const user = await this.userRepository.validateUserPassword(signInDto);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    //Creates the access and refresh tokens for the user
    const payload: JwtPayload = { email: user.email };
    const tokens: AccessAndRefreshTokenPyaload =
      await this.createAcessAndRefreshToken(payload);

    const responseData: SignInAndSignUpResponsePyaload = {
      firstName: user.firstName,
      lastName: user.lastName,
      displayName: user.displayName,
      email: user.email,
      userType: user.userType,
      balance: user.balance,
      rib: user.rib,
      address: user.address,
      phoneNumber: user.phoneNumber,
      city: user.city,
      zipCode: user.zipCode,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
    return responseData;
  }

  //Function that changes the user Password
  async updatePassword(
    user: User,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<{ message: string }> {
    const { password, newPassword, newPasswordConfirmation } =
      updatePasswordDto;

    //check if the password is a valid return error if false
    if (
      !(await this.userRepository.validatePassword(
        password,
        user.salt,
        user.password,
      ))
    ) {
      throw new BadRequestException('Password Is Wrong');
    }
    //if password is valid check new password with confirmation of new password
    if (newPassword !== newPasswordConfirmation) {
      throw new BadRequestException('New password does not match');
    }

    //create new hashed password and update the old password with new password
    const hashedNewPassword = await this.userRepository.hashPassword(
      newPassword,
      user.salt,
    );
    await this.userModel.findByIdAndUpdate(
      { _id: user._id },
      { password: hashedNewPassword },
    );

    return { message: 'Password Updated Successfully' };
  }

  //Function that refreshes the access token for the user
  async refreshToken(
    user: User,
    refreshTokenDto: RefreshTokenDto,
  ): Promise<{ accessToken }> {
    if (user.refreshToken !== refreshTokenDto.refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const payload: JwtPayload = { email: user.email };

    const accessToken = await this.createToken(payload);

    return { accessToken };
  }

  //Function that creates the Access and RefreshToken
  async createAcessAndRefreshToken(
    payload: JwtPayload,
  ): Promise<AccessAndRefreshTokenPyaload> {
    const accessToken = await this.createToken(payload);
    const refreshToken = await this.createToken({ accessToken });
    await this.userModel.findOneAndUpdate(
      { email: payload.email },
      { refreshToken },
    );

    return { accessToken, refreshToken };
  }

  //Function that creates the a Token for the user
  async createToken(payload): Promise<string> {
    const token = await this.jwtService.sign(payload);
    return token;
  }

  async getUser(_id: User): Promise<User> {
    try {
      const user = await this.userModel.findById({ _id });
      return user;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
