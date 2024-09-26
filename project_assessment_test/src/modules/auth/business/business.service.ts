import { Inject, Injectable } from '@nestjs/common';
import { UserService } from 'src/services/user/user.service';

@Injectable()
export class BusinessService {
  constructor(@Inject() private readonly userService: UserService) {}
  async login(email: string, password: string) {
    return await this.userService.login(email, password);
  }
}
