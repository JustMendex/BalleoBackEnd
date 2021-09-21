import { Body, Controller, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { Getuser } from './get-user.decorator';
import { SignInAndSignUpResponsePyaload } from './signin-and-signup-response-payload.interface';
import { User } from './user.schema';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signUp')
  async signUp(
    @Body() signUpDto: SignUpDto,
  ): Promise<SignInAndSignUpResponsePyaload> {
    return this.authService.signUp(signUpDto);
  }

  @Post('signIn')
  async signIn(
    @Body() signInDto: SignInDto,
  ): Promise<SignInAndSignUpResponsePyaload> {
    return this.authService.signIn(signInDto);
  }

  @Post('refreshToken')
  @UseGuards(AuthGuard())
  async refreshToken(
    @Getuser()
    user: User,
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<{ accessToken }> {
    return this.authService.refreshToken(user, refreshTokenDto);
  }

  @Patch('updatePassword')
  @UseGuards(AuthGuard())
  async updatePassword(
    @Getuser()
    user: User,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<{ message: string }> {
    return this.authService.updatePassword(user, updatePasswordDto);
  }
}
