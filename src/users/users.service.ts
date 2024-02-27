import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/user-create.dto';
import { SigInUserDto } from './dto/user-sig-in.dto';
import * as jwt from 'jsonwebtoken';
import * as CryptoJS from 'crypto-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @Inject(ConfigService) private configService: ConfigService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  private readonly JWT_SECRET = process.env.JWT_SECRET;
  private readonly AUTH0_SECRET = process.env.AUTH0_SECRET;

  private encrypt(message: string): string {
    return CryptoJS.AES.encrypt(
      message,
      this.configService.getOrThrow('ENCRYPTION_KEY'),
    ).toString();
  }

  private decrypt(ciphertext: string): string {
    const bytes = CryptoJS.AES.decrypt(
      ciphertext,
      this.configService.getOrThrow('ENCRYPTION_KEY'),
    );
    return bytes.toString(CryptoJS.enc.Utf8);
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
    const newUser = this.userRepository.create({
      ...user,
      name: this.encrypt(user.name),
      username: this.encrypt(user.username),
      lastname: this.encrypt(user.lastname),
    });
    const userDb = await this.userRepository.save(newUser);
    const token = jwt.sign({ id: userDb.id }, this.JWT_SECRET, {
      expiresIn: '24h',
    });
    return { userDb, token };
  }

  async logIn(user: SigInUserDto, signing: string) {
    try {
      let decodedToken = jwt.verify(signing, this.AUTH0_SECRET) as {
        [key: string]: any;
      };
      if (user.email === decodedToken.email) {
        const fullUser = await this.userRepository.findOne({
          where: { email: user.email },
          select: {
            id: true,
          },
        });
        if (!fullUser) {
          return new HttpException(
            'the account you are trying to access does not exist, please register',
            HttpStatus.NOT_FOUND,
          );
        }
        if (fullUser.ban) {
          return new HttpException(
            'access prohibited, user banned',
            HttpStatus.FORBIDDEN,
          );
        }

        await this.userRepository.save({
          ...fullUser,
          last_connection: new Date(),
        });

        const token = jwt.sign({ id: fullUser.id }, this.JWT_SECRET, {
          expiresIn: '24h',
        });

        return { fullUser, token };
      } else {
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
      }
    } catch (error) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }

  async verify(token: string) {
    return jwt.verify(token, this.JWT_SECRET, async (_error, decoded: User) => {
      if (decoded !== undefined) {
        const user = await this.userRepository.findOne({
          where: { id: decoded.id },
        });

        if (user) {
          return user.id;
        }
      } else {
        throw new UnauthorizedException(
          `Non authorized token. Error:${_error.message}`,
        );
      }
    });
  }

  /**
   * This section must be changed in the future
   * cause we must change our form to manage user roles
   * @param token
   *
   * If user is admin, the method returns a true
   * @returns `true`
   *
   * If user is not admin, the method return a false
   * @returns `false`
   *
   * If user is Banned, returns an error
   * @throws {response: `User is banned`, status: 403}
   */
  async roleVerification(token: string) {
    return jwt.verify(token, this.JWT_SECRET, async (_error, decoded: User) => {
      if (decoded !== undefined) {
        const user = await this.userRepository.findOne({
          where: { id: decoded.id },
        });
        if (user.ban)
          throw new HttpException(
            `User ${user.username} is banned`,
            HttpStatus.FORBIDDEN,
          );
        if (!user.admin) {
          throw new HttpException(
            `User ${user.username} is not admin`,
            HttpStatus.UNAUTHORIZED,
          );
        }
        return true;
      } else {
        throw new HttpException('Non authorized token', HttpStatus.BAD_REQUEST);
      }
    });
  }
}
