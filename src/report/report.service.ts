import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ReportService {
  constructor(private readonly prisma: PrismaService) {}

  private async generateWorkbook(
    entityName: string,
    data: any[],
    columns: any[],
  ) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(entityName);

    // Добавляем дату скачивания
    worksheet.addRow([`Дата генерации отчета: ${new Date().toLocaleString()}`]);
    worksheet.addRow([]); // Пустая строка для разделения
    worksheet.columns = columns;

    // Заполняем данными
    data.forEach((item) => {
      worksheet.addRow(Object.values(item));
    });

    // Генерируем buffer
    return await workbook.xlsx.writeBuffer();
  }

  // **Генерация отчета по пользователям**
  async generateUserReport() {
    const users = await this.prisma.user.findMany();

    const data = users.map((user) => ({
      userId: user.userId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      middleName: user.middleName ?? '',
      userName: user.userName ?? '',
      role: user.role,
      createdAt: user.createdAt.toISOString(),
    }));

    return this.generateWorkbook('Users', data, [
      { header: 'ID', key: 'userId', width: 36 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Имя', key: 'firstName', width: 20 },
      { header: 'Фамилия', key: 'lastName', width: 20 },
      { header: 'Отчество', key: 'middleName', width: 20 },
      { header: 'Username', key: 'userName', width: 20 },
      { header: 'Роль', key: 'role', width: 15 },
      { header: 'Дата создания', key: 'createdAt', width: 25 },
    ]);
  }

  // **Генерация отчета по мероприятиям**
  async generateEventReport() {
    const events = await this.prisma.event.findMany();

    const data = events.map((event) => ({
      eventId: event.eventId,
      title: event.title,
      description: event.description,
      organizer: event.organizer,
      link: event.link,
      date: event.date.toISOString(),
      places: event.places,
      status: event.status,
      createdAt: event.createdAt.toISOString(),
    }));

    return this.generateWorkbook('Events', data, [
      { header: 'ID', key: 'eventId', width: 36 },
      { header: 'Название', key: 'title', width: 30 },
      { header: 'Описание', key: 'description', width: 50 },
      { header: 'Организатор', key: 'organizer', width: 25 },
      { header: 'Ссылка', key: 'link', width: 30 },
      { header: 'Дата', key: 'date', width: 25 },
      { header: 'Места', key: 'places', width: 10 },
      { header: 'Статус', key: 'status', width: 15 },
      { header: 'Дата создания', key: 'createdAt', width: 25 },
    ]);
  }

  // **Генерация отчета по заявкам**
  async generateApplicationReport() {
    const applications = await this.prisma.application.findMany({
      include: {
        user: true,
        event: true,
      },
    });

    const data = applications.map((app) => ({
      applicationId: app.id,
      places: app.places,
      createdAt: app.createdAt.toISOString(),
      userId: app.userId,
      firstName: app.user.firstName,
      lastName: app.user.lastName,
      middleName: app.user.middleName ?? '',
      eventId: app.eventId,
      eventTitle: app.event.title,
    }));

    return this.generateWorkbook('Applications', data, [
      { header: 'ID', key: 'applicationId', width: 36 },
      { header: 'Места', key: 'places', width: 10 },
      { header: 'Дата создания', key: 'createdAt', width: 25 },
      { header: 'ID пользователя', key: 'userId', width: 36 },
      { header: 'Имя', key: 'firstName', width: 20 },
      { header: 'Фамилия', key: 'lastName', width: 20 },
      { header: 'Отчество', key: 'middleName', width: 20 },
      { header: 'ID мероприятия', key: 'eventId', width: 36 },
      { header: 'Название мероприятия', key: 'eventTitle', width: 30 },
    ]);
  }
}
