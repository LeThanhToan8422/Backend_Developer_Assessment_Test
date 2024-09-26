import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { BusinessService } from './business/business.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: BusinessService) {}

  @Post('login')
  //   @UseGuards(AuthGuard('local'))
  async login(@Req() request: Request, @Res() response: Response) {
    const { email, password } = request.body;
    const result = await this.authService.login(email, password);
    return response.json(result);
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  async logout(@Req() request: Request, @Res() response: Response) {
    return response.json(request.user);
  }
}
