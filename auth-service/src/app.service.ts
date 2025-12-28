import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import * as bcrypt from 'bcrypt';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(private userRepository: UserRepository) { }

  async createUser(userData: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    return this.userRepository.create({
      ...userData,
      password: hashedPassword,
    } as Partial<User>);
  }

  async validateUser(email: string, pass: string): Promise<Partial<User>> {
    const user = await this.userRepository.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user.toObject();
      return result;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async updateName(id: string, name: string): Promise<User | null> {
    return this.userRepository.update(id, { name });
  }

  async updatePassword(id: string, pass: string): Promise<User | null> {
    const hashedPassword = await bcrypt.hash(pass, 10);
    return this.userRepository.update(id, { password: hashedPassword });
  }
}
