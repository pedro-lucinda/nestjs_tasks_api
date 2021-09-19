import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDTO } from './DTOs/auth-credentials.dto';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './types/jwt-payload.interface';
import { User } from './user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async listUsers(): Promise<Omit<User, 'password'>[]> {
    const users = await this.userRepository.find();
    const formmated = users.map((user: User) => {
      return {
        userName: user.userName,
        id: user.id,
      };
    });

    return formmated as Omit<User, 'password'>[];
  }

  async signUp(authCredentialsDTO: AuthCredentialsDTO): Promise<void> {
    return await this.userRepository.createUser(authCredentialsDTO);
  }
  async signIn(
    authCredentialsDTO: AuthCredentialsDTO,
  ): Promise<{ accessToken: string }> {
    const { userName, password } = authCredentialsDTO;

    const user = await this.userRepository.findOne({ userName });
    const isPassWordValid =
      user && (await bcrypt.compare(password, user.password));

    if (!user || !isPassWordValid) {
      throw new UnauthorizedException('Please check your credentials');
    }

    const payload: JwtPayload = {
      userName,
      id: user.id,
    };

    const accessToken = await this.jwtService.sign(payload);
    return { accessToken };
  }
}
