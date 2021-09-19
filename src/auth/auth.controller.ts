import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDTO } from './DTOs/auth-credentials.dto';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/')
  async listUsers(): Promise<Omit<User, 'password'>[]> {
    return await this.authService.listUsers();
  }

  @Post('/signup')
  async signUp(@Body() authCredentialsDTO: AuthCredentialsDTO): Promise<void> {
    return await this.authService.signUp(authCredentialsDTO);
  }

  @Post('/signin')
  async signIn(
    @Body() authCredentialsDTO: AuthCredentialsDTO,
  ): Promise<{ accessToken: string }> {
    return await this.authService.signIn(authCredentialsDTO);
  }
}
