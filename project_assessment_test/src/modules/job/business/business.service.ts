import { Inject, Injectable } from '@nestjs/common';
import { JobService } from 'src/services/job/job.service';
import JobDto from '../dtos/job.dto';

@Injectable()
export class BusinessService {
  @Inject() private readonly jobService: JobService;

  async createJob(job: JobDto) {
    return await this.jobService.createJob(job);
  }

  async updateJob(jobId: number, job: JobDto) {
    return await this.jobService.updateJob(jobId, job);
  }

  async getJobs(page: number, limit: number) {
    return await this.jobService.getJobs(page, limit);
  }

  async getJobsByUserId(
    userId: number,
    title: string = '',
    status: number = -1,
    page: number,
    limit: number,
    order: string,
    sort: 'ASC' | 'DESC' = 'ASC',
  ) {
    return await this.jobService.getJobsByUserId(
      userId,
      title,
      status,
      page,
      limit,
      order,
      sort,
    );
  }

  async getJobById(jobId: number) {
    return await this.jobService.getJobById(jobId);
  }

  async deleteJobById(jobId: number) {
    return await this.jobService.deleteJobById(jobId);
  }
}
