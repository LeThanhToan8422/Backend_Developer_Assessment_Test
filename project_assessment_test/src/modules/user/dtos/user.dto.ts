import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export default class UserDto {
  @IsOptional()
  @IsNumber()
  id: number;
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Expose()
  @ApiProperty({ example: 'example@gmail.com', description: 'Email of user' })
  email: string;
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{4,}$/, {
    message:
      'Password is required and must be at least 4 characters long, containing letters, numbers, and special characters.',
  })
  @Expose()
  // @Exclude({ toPlainOnly: true })
  @ApiProperty({ example: 'ExamplePass@123', description: 'Password of user' })
  password: string;
  @IsOptional()
  @IsBoolean()
  @Expose()
  status: boolean;
}
