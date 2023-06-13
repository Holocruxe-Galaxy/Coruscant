import { Body, Controller, Get, Post, Res, HttpStatus } from '@nestjs/common';
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
      res.status(HttpStatus.BAD_REQUEST).send(errors);
    }
    const newUser = await this.userService.createUser(user);
    if (newUser['status'] == 409) {
      res.status(HttpStatus.CONFLICT).send(newUser);
    }
    res.status(HttpStatus.CREATED).send(newUser);
  }
  @Post('sigin')
  async sigIn(@Res() res: Response, @Body() user: SigInUserDto) {
    const errors = await validate(plainToClass(SigInUserDto, user));

    if (errors.length > 0) {
      res.status(HttpStatus.BAD_REQUEST).send(errors);
    }
    const sigIn = await this.userService.sigIn(user);

    if (sigIn['status'] == 400) {
      res.status(HttpStatus.BAD_REQUEST).send(sigIn);
    }
    res.status(HttpStatus.ACCEPTED).send(sigIn);
  }
}
