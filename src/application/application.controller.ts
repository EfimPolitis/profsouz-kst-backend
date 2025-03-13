import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ApplicationService } from './application.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CreateApplicationDto } from './dto/create-application.dto';
import { getAllApplicationsDto } from './dto/get-all-application.dto';
import { ReportService } from 'src/report/report.service';
import { Response } from 'express';

@Controller('application')
export class ApplicationController {
  constructor(
    private readonly applicationService: ApplicationService,
    private readonly reportService: ReportService,
  ) {}

  @Auth('MODER')
  @Get()
  async getAllApplication(@Query() dto: getAllApplicationsDto) {
    return this.applicationService.getAll(dto);
  }

  @Auth('MODER')
  @Get('report')
  @Header(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  )
  async downloadReport(@Res() res: Response) {
    let buffer = await this.reportService.generateApplicationReport();
    let fileName = `application_report_${new Date(Date.now()).toISOString().slice(0, -14)}`;

    res.setHeader(
      'Content-Disposition',
      `attachment; filename*=UTF-8''${fileName}`,
    );
    res.send(buffer);
  }

  @Auth('USER')
  @Get(':userId')
  async getUserApplication(@Param('userId') userId: string) {
    return this.applicationService.getByUserId(userId);
  }

  @Auth('')
  @Post()
  async createApplication(@Body() dto: CreateApplicationDto) {
    return this.applicationService.create(dto);
  }
}
