import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/user-create.dto';
import { SigInUserDto } from './dto/user-sig-in.dto';
import * as jwt from 'jsonwebtoken';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  private readonly JWT_SECRET = process.env.JWT_SECRET;

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
    const userDb = await this.userRepository.save(newUser);
    const token = jwt.sign({ ...userDb }, this.JWT_SECRET, {
      expiresIn: '1h',
    });
    return token;
  }

  async logIn(user: SigInUserDto) {
    const already = await this.userRepository.findOne({
      where: { email: user.email },
    });
    if (!already) {
      return new HttpException(
        'the account you are trying to access does not exist, please register',
        HttpStatus.NOT_FOUND,
      );
    }
    if (already.ban) {
      return new HttpException(
        'access prohibited, user banned',
        HttpStatus.FORBIDDEN,
      );
    }
    const alreadySigin = { ...already, last_connection: new Date() };
    await this.userRepository.save(alreadySigin);
    const token = jwt.sign(alreadySigin, this.JWT_SECRET, { expiresIn: '1h' });
    return token;
  }

  async verify(token: string) {
    return jwt.verify(token, this.JWT_SECRET, async (_error, decoded: User) => {
      if (decoded !== undefined) {
        const user = await this.userRepository.findOne({
          where: { email: decoded.email },
        });
        if (user) {
          return new HttpException('User Authorized', HttpStatus.NO_CONTENT);
        }
        throw new HttpException('User non Authorized', HttpStatus.UNAUTHORIZED);
      } else {
        throw new HttpException('Non authorized token', HttpStatus.FORBIDDEN);
      }
    });
  }
}
