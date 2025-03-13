import { Controller, Get, NotFoundException, Res } from '@nestjs/common';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';

@Controller('download')
export class DownloadController {
  @Get()
  async downloadFile(@Res() res: Response) {
    const filePath = path.join(
      process.cwd(),
      'files',
      'profunion-kst-desktop-1.2.1-setup.exe',
    ); // путь к файлу

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Файл не найден');
    }

    res.set({
      'Content-Disposition':
        'attachment; filename="profunion-kst-desktop-1.2.1-setup.exe"',
      'Content-Type': 'application/octet-stream',
    });

    const fileStream = fs.createReadStream(filePath);

    fileStream.pipe(res);
  }
}
