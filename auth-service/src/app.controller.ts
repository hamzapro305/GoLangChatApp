import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { AuthService } from './app.service';
import { CreateUserDto, ValidateUserDto, UpdateNameDto, UpdatePasswordDto } from './dto/auth.dto';
import { User } from './schemas/user.schema';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) { }

  @Post('users')
  async register(@Body() userData: CreateUserDto): Promise<{ user: User }> {
    const user = await this.authService.createUser(userData);
    return { user };
  }

  @Post('auth/validate')
  async validate(@Body() body: ValidateUserDto): Promise<{ user: Partial<User> }> {
    const user = await this.authService.validateUser(body.email, body.password);
    return { user };
  }

  @Get('users/email/:email')
  async getUserByEmail(@Param('email') email: string): Promise<{ user: User | null }> {
    const user = await this.authService.findByEmail(email);
    return { user };
  }

  @Get('users/:id')
  async getUserById(@Param('id') id: string): Promise<{ user: User | null }> {
    const user = await this.authService.findById(id);
    return { user };
  }

  @Get('users')
  async getAllUsers(): Promise<{ users: User[] }> {
    const users = await this.authService.findAll();
    return { users };
  }

  @Post('users/:id/update-name')
  async updateName(@Param('id') id: string, @Body() body: UpdateNameDto): Promise<{ user: User | null }> {
    const user = await this.authService.updateName(id, body.name);
    return { user };
  }

  @Post('users/:id/update-password')
  async updatePassword(@Param('id') id: string, @Body() body: UpdatePasswordDto): Promise<{ user: User | null }> {
    const user = await this.authService.updatePassword(id, body.password);
    return { user };
  }
}
