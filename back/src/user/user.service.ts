import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async getUsers() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
      },
    });
    return users;
  }

  async getUser({ userId }: { userId: string }) {
    const user = await this.prisma.user.findUniqueOrThrow({
      select: {
        email: true,
        firstName: true,
      },
      where: {
        id: userId,
      },
    });

    return user;
  }
}
