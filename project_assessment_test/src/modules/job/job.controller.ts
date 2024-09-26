import { Controller, Delete, Get, Post, Put, Req, Res } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { BusinessService } from './business/business.service';
import { Request, Response } from 'express';
import JobDto from './dtos/job.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

@ApiTags('Jobs')
@Controller('jobs')
export class JobController {
  constructor(private business: BusinessService) {}

  @Throttle({ default: { limit: 20, ttl: 60 } })
  @ApiOperation({ summary: 'Create a new job' })
  @ApiResponse({ status: 201, description: 'Job created successfully' })
  @ApiResponse({ status: 400, description: 'Data invalid' })
  @ApiBody({ type: JobDto })
  @Post('create')
  async createJob(@Req() request: Request, @Res() response: Response) {
    const job = plainToInstance(JobDto, request.body);
    const errors = await validate(job);
    if (errors.length > 0) {
      return response.status(400).json({
        code: 'BAD REQUEST',
        errors: errors,
      });
    }

    const result = await this.business.createJob(job);
    return response.status(201).json(result);
  }

  @Throttle({ default: { limit: 15, ttl: 60 } })
  @ApiOperation({ summary: 'Update a new job by id' })
  @ApiResponse({ status: 200, description: 'Job updated successfully' })
  @ApiResponse({ status: 400, description: 'Data invalid' })
  @ApiBody({ type: JobDto })
  @ApiParam({ name: 'id', description: 'Id of job' })
  @Put('update/:id')
  async updateJob(@Req() request: Request, @Res() response: Response) {
    const job = plainToInstance(JobDto, request.body);
    // const job = plainToClassFromExist(jobDto, { id: request.params.id });
    const errors = await validate(job);
    if (errors.length > 0) {
      return response.status(400).json({
        code: 'BAD REQUEST',
        errors: errors,
      });
    }
    const result = await this.business.updateJob(
      Number(request.params.id),
      job,
    );
    return response.status(200).json(result);
  }

  @Throttle({ default: { limit: 100, ttl: 60 } })
  @ApiOperation({ summary: 'Get list of jobs' })
  @ApiResponse({ status: 200, description: 'Successfully' })
  @ApiResponse({ status: 400, description: 'Failed' })
  @ApiQuery({ name: 'page', required: true, description: 'Page of list' })
  @ApiQuery({
    name: 'limit',
    required: true,
    description: 'Quantities of page',
  })
  @Get()
  async getJobs(@Req() request: Request, @Res() response: Response) {
    const result = await this.business.getJobs(
      Number(request.query.page),
      Number(request.query.limit),
    );
    return response.status(200).json(result);
  }

  @Throttle({ default: { limit: 100, ttl: 60 } })
  @ApiOperation({ summary: 'Get list of jobs by userId' })
  @ApiResponse({ status: 200, description: 'Successfully' })
  @ApiResponse({ status: 400, description: 'Failed' })
  @ApiParam({ name: 'id', description: 'Id of user' })
  @ApiQuery({
    name: 'title',
    required: true,
    description: 'Title of job need to find',
  })
  @ApiQuery({
    name: 'status',
    required: true,
    description: 'status of job need to find',
  })
  @ApiQuery({
    name: 'order',
    required: true,
    description: 'Column want to sort ASC or DESC',
  })
  @ApiQuery({
    name: 'sort',
    required: true,
    description: 'ASC or DESC',
  })
  @ApiQuery({ name: 'page', required: true, description: 'Page of list' })
  @ApiQuery({
    name: 'limit',
    required: true,
    description: 'Quantities of page',
  })
  @Get('user/:id')
  async getJobsByUserId(@Req() request: Request, @Res() response: Response) {
    const sort: 'ASC' | 'DESC' = request.query.sort === 'ASC' ? 'ASC' : 'DESC';
    const result = await this.business.getJobsByUserId(
      Number(request.params.id),
      request.query.title + '',
      Number(request.query.status),
      Number(request.query.page),
      Number(request.query.limit),
      request.query.order + '',
      sort,
    );
    return response.status(200).json(result);
  }

  @Throttle({ default: { limit: 100, ttl: 60 } })
  @ApiOperation({ summary: 'Get a job by id' })
  @ApiResponse({ status: 200, description: 'Successfully' })
  @ApiResponse({ status: 400, description: 'Failed' })
  @ApiParam({ name: 'id', description: 'Id of job' })
  @Get(':id')
  async getJobById(@Req() request: Request, @Res() response: Response) {
    const result = await this.business.getJobById(Number(request.params.id));
    return response.status(200).json(result);
  }

  @Throttle({ default: { limit: 10, ttl: 60 } })
  @ApiOperation({ summary: 'Delete a job by id' })
  @ApiResponse({ status: 200, description: 'Successfully' })
  @ApiResponse({ status: 400, description: 'Failed' })
  @ApiParam({ name: 'id', description: 'Id of job' })
  @Delete(':id')
  async deleteJobById(@Req() request: Request, @Res() response: Response) {
    const result = await this.business.deleteJobById(Number(request.params.id));
    return response.status(200).json(result);
  }
}
