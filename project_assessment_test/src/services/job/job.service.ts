import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain } from 'class-transformer';
import Job from 'src/entities/job.entity';
import ErrorCustomizer from 'src/helper/error';
import Pagination from 'src/helper/pagination';
import ResponseCustomizer from 'src/helper/response';
import JobDto from 'src/modules/job/dtos/job.dto';
import { CRUDRepository } from 'src/repositories/generic.repository';
import { DataSource, FindOperator, Like, Repository } from 'typeorm';

@Injectable()
export class JobService {
  private jobRepository: CRUDRepository<Job>;
  constructor(
    @InjectRepository(Job) private repository: Repository<Job>,
    private datasource: DataSource,
  ) {
    this.jobRepository = new CRUDRepository<Job>(repository);
  }

  async createJob(job: JobDto) {
    const queryRunner = this.datasource.createQueryRunner();
    queryRunner.startTransaction();
    try {
      const jobResponse = await this.jobRepository.create(job);
      queryRunner.commitTransaction();
      return new ResponseCustomizer(instanceToPlain(jobResponse));
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return new ResponseCustomizer(
        null,
        new ErrorCustomizer(error.code, error.message, 500),
      );
    }
  }

  async updateJob(jobId: number, job: JobDto) {
    const queryRunner = this.datasource.createQueryRunner();
    queryRunner.startTransaction();
    try {
      const jobResponse = await this.jobRepository.update(jobId, job);
      if (jobResponse) {
        await queryRunner.commitTransaction();
        return new ResponseCustomizer(instanceToPlain(jobResponse));
      } else {
        return new ResponseCustomizer(
          null,
          new ErrorCustomizer('NOT FOUND', 'Job not found', 404),
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

  async getJobs(page: number, limit: number) {
    const jobsResponse = await this.jobRepository.getAll(page, limit);
    return new ResponseCustomizer(
      instanceToPlain(jobsResponse),
      null,
      new Pagination(page, limit),
    );
  }

  async getJobsByUserId(
    userId: number,
    title: string,
    status: number,
    page: number,
    limit: number,
    order: string,
    sort: 'ASC' | 'DESC',
  ) {
    const whereCondition: {
      userId: number;
      status?: number;
      title?: string | FindOperator<string>;
    } = {
      userId: userId,
    };
    if (status !== -1) {
      whereCondition.status = status;
    }
    if (title !== 'null') {
      whereCondition.title = Like(`%${title}%`);
    }
    const orderCondition = {};
    if (order) {
      orderCondition[order] = sort;
    }
    const jobs = await this.repository.findAndCount({
      relations: {
        user: true,
      },
      where: whereCondition,
      order: orderCondition,
      skip: (page - 1) * limit,
      take: limit,
    });

    return new ResponseCustomizer(
      instanceToPlain(jobs),
      null,
      new Pagination(page, limit),
    );
  }

  async getJobById(jobId: number) {
    const jobResponse = await this.jobRepository.getById(jobId);
    if (jobResponse) {
      return new ResponseCustomizer(instanceToPlain(jobResponse));
    }
    return new ResponseCustomizer(
      null,
      new ErrorCustomizer('NOT FOUND', 'Job not found', 404),
    );
  }

  async deleteJobById(jobId: number) {
    const queryRunner = this.datasource.createQueryRunner();
    queryRunner.startTransaction();
    try {
      const response = await this.jobRepository.delete(jobId);
      if (response) {
        await queryRunner.commitTransaction();
        return new ResponseCustomizer(instanceToPlain(response));
      }
      await queryRunner.rollbackTransaction();
      return new ResponseCustomizer(
        null,
        new ErrorCustomizer('NOT FOUND', 'Job not exists', 404),
        null,
      );
    } catch (error) {
      return new ResponseCustomizer(
        null,
        new ErrorCustomizer(error.code, error.message, 500),
      );
    }
  }
}
