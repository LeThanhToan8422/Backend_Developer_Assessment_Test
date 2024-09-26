import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain } from 'class-transformer';
import User from 'src/entities/user.entity';
import ErrorCustomizer from 'src/helper/error';
import Pagination from 'src/helper/pagination';
import ResponseCustomizer from 'src/helper/response';
import UserDto from 'src/modules/user/dtos/user.dto';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { CRUDRepository } from 'src/repositories/generic.repository';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  private userRepository: CRUDRepository<User>;
  constructor(
    @InjectRepository(User) private repository: Repository<User>,
    private jwtService: JwtService,
    private datasource: DataSource,
  ) {
    this.userRepository = new CRUDRepository<User>(repository);
  }

  async createUser(user: UserDto) {
    const queryRunner = this.datasource.createQueryRunner();
    queryRunner.startTransaction();
    try {
      const userResponse = await this.userRepository.create(user);
      await queryRunner.commitTransaction();
      return new ResponseCustomizer(instanceToPlain(userResponse));
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return new ResponseCustomizer(
        null,
        new ErrorCustomizer(error.code, error.message, 500),
      );
    }
  }

  async updateUser(userId: number, user: UserDto) {
    const queryRunner = this.datasource.createQueryRunner();
    queryRunner.startTransaction();
    try {
      const userResponse = await this.userRepository.update(userId, user);
      if (userResponse) {
        await queryRunner.commitTransaction();
        return new ResponseCustomizer(instanceToPlain(userResponse));
      } else {
        return new ResponseCustomizer(
          null,
          new ErrorCustomizer('NOT FOUND', 'User not found', 404),
        );
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return new ResponseCustomizer(
        null,
        new ErrorCustomizer(error.code, error.message, 500),
      );
    }
  }

  async getUsers(page: number, limit: number) {
    const users = await this.userRepository.getAll(page, limit);
    return new ResponseCustomizer(
      instanceToPlain(users),
      null,
      new Pagination(page, limit),
    );
  }

  async getUserById(userId: number) {
    const userResponse = await this.userRepository.getById(userId);
    if (userResponse) {
      return new ResponseCustomizer(instanceToPlain(userResponse));
    }
    return new ResponseCustomizer(
      null,
      new ErrorCustomizer('NOT FOUND', 'User not found', 404),
    );
  }

  async getUserByEmail(email: string) {
    const user = await this.repository.findOne({
      where: {
        email: email,
        status: true,
      },
    });
    return new ResponseCustomizer(instanceToPlain(user));
  }

  async deleteUserById(userId: number) {
    const queryRunner = this.datasource.createQueryRunner();
    queryRunner.startTransaction();
    try {
      const userResponse = await this.userRepository.delete(userId);
      if (userResponse) {
        await queryRunner.commitTransaction();
        return new ResponseCustomizer(instanceToPlain(userResponse));
      }
      await queryRunner.rollbackTransaction();
      return new ResponseCustomizer(
        null,
        new ErrorCustomizer('BAD REQUEST', 'User not exists', 404),
        null,
      );
    } catch (error) {
      return new ResponseCustomizer(
        null,
        new ErrorCustomizer(error.code, error.message, 500),
      );
    }
  }

  async login(email: string, password: string) {
    const user = await this.repository.findOne({
      where: {
        email: email,
        status: true,
      },
    });

    if (user) {
      const result = await bcrypt.compareSync(password, user.password);
      if (result) {
        const { password, ...userInfo } = user;
        const code = await this.jwtService.signAsync(userInfo, {
          secret: 'secret',
        });
        return new ResponseCustomizer({ code: code });
      } else {
        return new ResponseCustomizer(
          null,
          new ErrorCustomizer('Invalid password', 'Password not correct', 400),
        );
      }
    } else {
      return new ResponseCustomizer(
        null,
        new ErrorCustomizer('Not Found', 'User not found', 404),
      );
    }
  }
}
