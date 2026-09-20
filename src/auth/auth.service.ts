import { Injectable } from '@nestjs/common';
import { AuthBody } from './auth.controller';
import { PrismaService } from 'src/prisma.service';
import bcrypt, { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}
  async login({ authBody }: { authBody: AuthBody }) {
    const { email, password } = authBody;

    const existingUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!existingUser) {
      throw new Error("L'utilisateur n'existe pas.");
    }

    const isPasswordValid = await this.isPasswordValid({
      password,
      hashPasssword: existingUser.password,
    });

    if (!isPasswordValid) {
      throw new Error('Le mot de passe est invalide');
    }
    return existingUser.id;
  }

  async hashPasssword({ password }: { password: string }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  }

  async isPasswordValid({
    password,
    hashPasssword,
  }: {
    password: string;
    hashPasssword: string;
  }): Promise<boolean> {
    const isPasswordValid = await compare(password, hashPasssword);

    return isPasswordValid;
  }
}
