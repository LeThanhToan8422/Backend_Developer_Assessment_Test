import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { BusinessService } from './business/business.service';
import { UserService } from 'src/services/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/entities/user.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      global: true,
      secret: 'secret',
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [BusinessService, UserService, JwtService, JwtStrategy],
})
export class AuthModule {}
