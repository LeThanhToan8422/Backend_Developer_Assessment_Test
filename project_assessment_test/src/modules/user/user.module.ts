import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { BusinessService } from './business/business.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/entities/user.entity';
import { UserService } from 'src/services/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [BusinessService, UserService, JwtService],
})
export class UserModule {}
