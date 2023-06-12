import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/user-create.dto';
import { SigInUserDto } from './dto/user-sig-in.dto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  @Get()
  getUsers() {
    return this.userService.getUsers();
  }
  @Post('register')
  async createUser(@Body() user: CreateUserDto) {
    const errors = await validate(plainToClass(CreateUserDto, user));

    if (errors.length > 0) {
      return { errors };
    }
    return this.userService.createUser(user);
  }
  @Post('sigin')
  async sigIn(@Body() user: SigInUserDto) {
    const errors = await validate(plainToClass(SigInUserDto, user));

    if (errors.length > 0) {
      return { errors };
    }
    return this.userService.sigIn(user);
  }
}
