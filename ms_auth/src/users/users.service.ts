import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/user-create.dto';
import { SigInUserDto } from './dto/user-sig-in.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  getUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async createUser(user: CreateUserDto) {
    const already_user = await this.userRepository.findOne({
      where: { email: user.email },
    });
    if (already_user) {
      return new HttpException(
        'there is already a user associated with that email',
        HttpStatus.CONFLICT,
      );
    }

    const newUser = await this.userRepository.create(user);
    this.userRepository.save(newUser);
    return newUser;
  }

  async sigIn(user: SigInUserDto) {
    const already = await this.userRepository.findOne({
      where: { email: user.email },
    });
    if (!already) {
      return new HttpException(
        'the account you are trying to access does not exist, please register',
        HttpStatus.BAD_REQUEST,
      );
    }
    return already;
  }
}