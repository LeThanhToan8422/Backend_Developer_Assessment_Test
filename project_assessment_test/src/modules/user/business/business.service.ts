import { Inject, Injectable } from '@nestjs/common';
import UserDto from '../dtos/user.dto';
import { UserService } from 'src/services/user/user.service';

@Injectable()
export class BusinessService {
  @Inject() private readonly userService: UserService;

  async createUser(user: UserDto) {
    return await this.userService.createUser(user);
  }

  async updateUser(userId: number, user: UserDto) {
    return await this.userService.updateUser(userId, user);
  }

  async getUsers(page: number, limit: number) {
    return await this.userService.getUsers(page, limit);
  }

  async getUserById(userId: number) {
    return await this.userService.getUserById(userId);
  }

  async getUserByEmail(email: string) {
    return await this.userService.getUserByEmail(email);
  }

  async deleteUserById(userId: number) {
    return await this.userService.deleteUserById(userId);
  }

  async login(email: string, password: string) {
    return await this.userService.login(email, password);
  }
}
