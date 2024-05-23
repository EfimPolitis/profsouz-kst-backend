import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Auth } from './auth/decorators/auth.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { PrismaService } from './prisma.service';

@Controller('upload')
export class AppController {
  constructor(private prisma: PrismaService) {}

  @Auth('MODER')
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: 'public/uploads',
        filename: (req, image, cb) => {
          cb(null, image.originalname);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() image: Express.Multer.File) {
    const oldImage = await this.prisma.image.findUnique({
      where: {
        url: `http://localhost:5284/public/uploads/${image.filename}`,
      },
    });

    if (oldImage === null) {
      const data = await this.prisma.image.create({
        data: {
          url: `http://localhost:5284/public/uploads/${image.filename}`,
          name: image.filename,
        },
      });

      const response = {
        id: data.id,
        url: data.url,
      };

      return response;
    }

    const response = {
      id: oldImage.id,
      url: oldImage.url,
    };

    return response;
  }
}
