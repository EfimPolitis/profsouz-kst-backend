import { Injectable } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { PrismaService } from 'src/prisma.service';
import { EnumNewsSort, getManyNewsDto } from './dto/get-all-news.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class NewsService {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(dto: getManyNewsDto) {
    const { page, sort, search, created_at_start, created_at_end } = dto;

    const { prismaSort } = this._getSort(sort);
    const { prismaSearch } = this._getSearch(search);
    const { prismaFilter } = this._getFilter(created_at_start, created_at_end);

    const skip = Number(page) > 1 ? (Number(page) - 1) * 12 : 0;

    const countNews = await this.prisma.news.count({
      where: {
        AND: [prismaSearch, prismaFilter],
      },
    });
    const countPage =
      Math.ceil(countNews / 12) > 1 ? Math.ceil(countNews / 12) : 0;

    const data = await this.prisma.news.findMany({
      where: {
        AND: [prismaSearch, prismaFilter],
      },
      orderBy: prismaSort,
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
      skip,
      take: 12,
    });

    const news = data.map((news) => {
      const images = news.images.map(({ image }) => image);
      return {
        ...news,
        images,
      };
    });

    return { items: news, countPage };
  }

  async findById(newsId: string) {
    const data = await this.prisma.news.findUnique({
      where: {
        newsId,
      },
      include: {
        images: {
          select: {
            image: true,
          },
        },
      },
    });

    const news = {
      ...data,
      images: data.images.map(({ image }) => image),
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

  async update(newsId: string, dto: UpdateNewsDto) {
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
        newsId,
      },
      data: {
        title,
        description,
        content,
        images: {
          deleteMany: {
            newsId,
          },
          create: images,
        },
      },
    });
  }

  async updateView(newsId: string) {
    return await this.prisma.news.update({
      where: { newsId },
      data: { views: { increment: 1 } },
    });
  }

  async remove(newsId: string) {
    return this.prisma.news.delete({
      where: {
        newsId,
      },
    });
  }

  async uploadImage(image: Express.Multer.File) {
    const oldImage = await this.prisma.image.findUnique({
      where: {
        url: `http://localhost:5000/api/public/uploads/news/${image.filename}`,
      },
    });

    if (oldImage === null) {
      const data = await this.prisma.image.create({
        data: {
          url: `http://localhost:5000/api/public/uploads/news/${image.filename}`,
          name: image.filename,
        },
      });

      const response = {
        id: data.id,
        url: data.url,
        name: data.name,
      };

      return response;
    }

    const response = {
      id: oldImage.id,
      name: oldImage.name,
      url: oldImage.url,
    };

    return response;
  }

  async deleteImage(filename: string) {
    const countEventsWithCurrentImage = await this.prisma.newsImage.findMany({
      where: {
        image: {
          url: {
            contains: filename,
          },
        },
      },
    });

    if (countEventsWithCurrentImage.length > 1) return false;

    await this.prisma.image.delete({
      where: {
        url: `http://localhost:5000/api/public/uploads/news/${filename}`,
      },
    });

    return true;
  }

  private _getSort(sort: EnumNewsSort) {
    const prismaSort: Prisma.NewsOrderByWithAggregationInput[] = [];

    if (sort === EnumNewsSort.ALPHABETIC_ASC) prismaSort.push({ title: 'asc' });
    else if (sort === EnumNewsSort.ALPHABETIC_DESC)
      prismaSort.push({ title: 'desc' });
    else if (sort === EnumNewsSort.VIEWS_ASC) prismaSort.push({ views: 'asc' });
    else if (sort === EnumNewsSort.VIEWS_DESC)
      prismaSort.push({ views: 'desc' });
    else if (sort === EnumNewsSort.CREATED_AT_ASC)
      prismaSort.push({ createdAt: 'asc' });
    else if (sort === EnumNewsSort.CREATED_AT_DESC)
      prismaSort.push({ createdAt: 'desc' });

    return { prismaSort };
  }

  private _getSearch(search: string) {
    const prismaSearch: Prisma.NewsWhereInput = search
      ? {
          OR: [
            {
              title: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              description: {
                contains: search,
                mode: 'insensitive',
              },
            },
          ],
        }
      : {};

    return { prismaSearch };
  }

  private _getFilter(created_at_start: string, created_at_end: string) {
    const prismaFilter: Prisma.NewsWhereInput = {};

    if (created_at_start) {
      prismaFilter.createdAt = {
        gte: new Date(created_at_start),
      };
    }
    if (created_at_end) {
      prismaFilter.createdAt = {
        lte: new Date(created_at_end),
      };
    }

    return { prismaFilter };
  }
}
