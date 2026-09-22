import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UserPayload } from './jwt.strategy';
import { UserService } from 'src/user/user.service';

export type AuthBody = { email: string; password: string };
export type RequestWithUser = {
  user: UserPayload;
};

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  // 1 - Send user password and email
  // 2 - API returns a secured token
  @Post('login')
  async login(@Body() authBody: AuthBody) {
    return await this.authService.login({ authBody });
  }

  // 3 - Send secured token to the users

  @UseGuards(JwtAuthGuard)
  @Get('')
  async authenticateUser(@Request() request: RequestWithUser) {
    const user = await this.userService.getUser(request.user);
    return user;
  }
}
