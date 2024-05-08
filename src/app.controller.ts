import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Auth } from './auth/decorators/auth.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('upload')
export class AppController {
  @Auth('')
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
    const response = {
      message: 'File uploaded successfully!',
      data: {
        originalname: image.originalname,
        filename: image.filename,
        url: `/public/uploads/${image.filename}`,
      },
    };
    return response;
  }
}
