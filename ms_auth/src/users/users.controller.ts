import {
  Body,
  Controller,
  Headers,
  Post,
  Res,
  HttpStatus,
  HttpException,
  Get,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/user-create.dto';
import { SigInUserDto } from './dto/user-sig-in.dto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('register')
  async createUser(@Res() res: Response, @Body() user: CreateUserDto) {
    const errors = await validate(plainToClass(CreateUserDto, user));

    if (errors.length > 0) {
      return res.status(HttpStatus.BAD_REQUEST).send(errors);
    }
    const newUser = await this.userService.createUser(user);
    if (newUser['status'] === 409) {
      return res.status(HttpStatus.CONFLICT).send(newUser);
    }
    return res
      .status(HttpStatus.CREATED)
      .header({ Authorization: newUser['token'] })
      .send(newUser['userDb']);
  }
  @Post('login')
  async logIn(@Res() res: Response, @Body() user: SigInUserDto) {
    const errors = await validate(plainToClass(SigInUserDto, user));
    if (errors.length > 0) {
      return res.status(HttpStatus.BAD_REQUEST).send(errors);
    }
    const signIn = await this.userService.logIn(user);
    if (signIn['status'] === 404) {
      return res.status(HttpStatus.NOT_FOUND).send(signIn);
    }
    if (signIn['status'] === 403) {
      return res.status(HttpStatus.FORBIDDEN).send(signIn);
    }
    return res
      .status(HttpStatus.ACCEPTED)
      .header({ Authorization: signIn['token'] })
      .send(signIn['alreadySigin']);
  }
  @Get('verify')
  async verify(@Res() res: Response, @Headers() headers: any) {
    try {
      if (!headers.authorization) {
        throw new HttpException('Token needed', HttpStatus.BAD_REQUEST);
      }
      if (headers.authorization.split(' ')[0] != 'Bearer') {
        throw new HttpException('Wrong method', HttpStatus.NOT_ACCEPTABLE);
      }
      const token = headers.authorization.split(' ')[1];
      const verify = await this.userService.verify(token);
      return res.status(HttpStatus.ACCEPTED).json({ userMail: verify });
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }
  @Get('permissions')
  async accesPermisions(@Res() res: Response, @Headers() headers: any) {
    try {
      const token = headers.authorization.split(' ')[1];
      await this.userService.roleVerification(token);
      return res
        .status(HttpStatus.ACCEPTED)
        .json({ status: 'success', messaje: 'The user is admin' });
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }
}
