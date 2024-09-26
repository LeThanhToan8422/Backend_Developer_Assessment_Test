import { Module } from '@nestjs/common';
import { JobController } from './job.controller';
import { BusinessService } from './business/business.service';
import { JobService } from 'src/services/job/job.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Job from 'src/entities/job.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Job])],
  controllers: [JobController],
  providers: [BusinessService, JobService],
})
export class JobModule {}
