import { Injectable } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class NewsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const rawNews = await this.prisma.news.findMany({
      include: {
        images: {
          select: {
            image: {
              select: {
                id: true,
                name: true,
                url: true,
              },
            },
          },
        },
      },
    });

    const news = rawNews.map((news) => {
      const images = news.images.map(({ image }) => image);
      return {
        ...news,
        images,
      };
    });

    return news;
  }

  async findOne(id: string) {
    const rawNews = await this.prisma.news.findUnique({
      where: {
        id,
      },
      include: {
        images: {
          select: {
            image: {
              select: {
                id: true,
                name: true,
                url: true,
              },
            },
          },
        },
      },
    });

    const news = {
      ...rawNews,
      images: rawNews.images.map(({ image }) => image),
    };

    return news;
  }

  async create(dto: CreateNewsDto) {
    const { title, description, content, imagesId } = dto;

    const images = [];

    for (let i = 0; i <= imagesId.length - 1; i++) {
      images.push({
        image: {
          connect: {
            id: imagesId[i],
          },
        },
      });
    }

    return this.prisma.news.create({
      data: {
        title,
        description,
        content,
        images: {
          create: images,
        },
      },
    });
  }

  async update(id: string, dto: UpdateNewsDto) {
    const { title, description, content, imagesId } = dto;

    const images = [];

    for (let i = 0; i <= imagesId.length - 1; i++) {
      images.push({
        image: {
          connect: {
            id: imagesId[i],
          },
        },
      });
    }

    return this.prisma.news.update({
      where: {
        id,
      },
      data: {
        title,
        description,
        content,
        images: {
          create: images,
        },
      },
    });
  }

  async remove(id: string) {
    return this.prisma.news.delete({
      where: {
        id,
      },
    });
  }
}
