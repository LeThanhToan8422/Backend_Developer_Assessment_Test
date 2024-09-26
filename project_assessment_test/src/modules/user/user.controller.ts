import { Controller, Delete, Get, Post, Put, Req, Res } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import UserDto from './dtos/user.dto';
import { BusinessService } from './business/business.service';
import { validate } from 'class-validator';
import ErrorCustomizer from 'src/helper/error';
import ResponseCustomizer from 'src/helper/response';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private business: BusinessService) {}

  @Throttle({ default: { limit: 20, ttl: 60 } })
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Data invalid' })
  @ApiBody({ type: UserDto })
  @Post('create')
  async createUser(@Req() request: Request, @Res() response: Response) {
    const user = plainToInstance(UserDto, request.body);
    const errors = await validate(user);
    if (errors.length > 0) {
      const messageErrors = errors.map((e) => {
        return {
          property: e.property,
          constraints: e.constraints,
        };
      });
      return response.json(
        new ResponseCustomizer(
          null,
          new ErrorCustomizer('BAD_REQUEST', messageErrors, 400),
        ),
      );
    }

    const result = await this.business.createUser(user);
    return response.status(201).json(result);
  }

  @Throttle({ default: { limit: 15, ttl: 60 } })
  @ApiOperation({ summary: 'Update a user by id' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 400, description: 'Data invalid' })
  @ApiBody({ type: UserDto })
  @ApiParam({ name: 'id', description: 'Id of user' })
  @Put('update/:id')
  async updateUser(@Req() request: Request, @Res() response: Response) {
    const user = plainToInstance(UserDto, request.body);
    const errors = await validate(user);
    if (errors.length > 0) {
      return response.status(400).json({
        code: 'BAD REQUEST',
        errors: errors,
      });
    }
    const result = await this.business.updateUser(
      Number(request.params.id),
      user,
    );
    return response.status(200).json(result);
  }

  @Throttle({ default: { limit: 100, ttl: 60 } })
  @ApiOperation({ summary: 'Get list of users' })
  @ApiResponse({ status: 200, description: 'Successfully' })
  @ApiResponse({ status: 400, description: 'Failed' })
  @ApiQuery({ name: 'page', required: true, description: 'Page of list' })
  @ApiQuery({
    name: 'limit',
    required: true,
    description: 'Quantities of page',
  })
  @Get()
  async getUsers(@Req() request: Request, @Res() response: Response) {
    const result = await this.business.getUsers(
      Number(request.query.page),
      Number(request.query.limit),
    );
    return response.status(200).json(result);
  }

  @Throttle({ default: { limit: 100, ttl: 60 } })
  @ApiOperation({ summary: 'Get a user by id' })
  @ApiResponse({ status: 200, description: 'Successfully' })
  @ApiResponse({ status: 400, description: 'Failed' })
  @ApiParam({ name: 'id', description: 'Id of user' })
  @Get(':id')
  async getUserById(@Req() request: Request, @Res() response: Response) {
    const result = await this.business.getUserById(Number(request.params.id));
    return response.status(200).json(result);
  }

  @Throttle({ default: { limit: 100, ttl: 60 } })
  @ApiOperation({ summary: 'Get a user by email' })
  @ApiResponse({ status: 200, description: 'Successfully' })
  @ApiResponse({ status: 400, description: 'Failed' })
  @ApiParam({ name: 'email', description: 'Email of user' })
  @Get('email/:email')
  async getUserByEmail(@Req() request: Request, @Res() response: Response) {
    const result = await this.business.getUserByEmail(request.params.email);
    return response.status(200).json(result);
  }

  @Throttle({ default: { limit: 10, ttl: 60 } })
  @ApiOperation({ summary: 'Delete a user by id' })
  @ApiResponse({ status: 200, description: 'Successfully' })
  @ApiResponse({ status: 400, description: 'Failed' })
  @ApiParam({ name: 'id', description: 'Id of user' })
  @Delete(':id')
  async deleteUserById(@Req() request: Request, @Res() response: Response) {
    const result = await this.business.deleteUserById(
      Number(request.params.id),
    );
    return response.status(200).json(result);
  }

  @Throttle({ default: { limit: 100, ttl: 60 } })
  @ApiOperation({ summary: 'Login user by email, password' })
  @ApiResponse({ status: 200, description: 'Successfully' })
  @ApiResponse({ status: 400, description: 'Failedd' })
  @ApiBody({ type: UserDto })
  @Post('login')
  async login(@Req() request: Request, @Res() response: Response) {
    const { email, password } = request.body;
    const result = await this.business.login(email + '', password + '');
    return response.status(200).json(result);
  }
}
