import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export default class JobDto {
  @IsOptional()
  @IsNumber()
  id: number;
  @IsNotEmpty()
  @IsString()
  @Expose()
  @ApiProperty({ example: 'Example Tile', description: 'title of job' })
  title: string;
  @IsNotEmpty()
  @IsString()
  @Expose()
  @ApiProperty({ example: 'Example Content', description: 'content of job' })
  content: string;
  @IsNotEmpty()
  @IsString()
  @Expose()
  @ApiProperty({ example: '2024-10-30T17:00', description: 'deadline of job' })
  deadline: Date;
  @IsNotEmpty()
  @IsNumber()
  @Expose()
  @ApiProperty({ example: '6', description: 'userId of job' })
  userId: number;
}
