import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/user-create.dto';
import { SigInUserDto } from './dto/user-sig-in.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  @Get()
  getUsers() {
    return this.userService.getUsers();
  }
  @Post('register')
  createUser(@Body() user: CreateUserDto) {
    return this.userService.createUser(user);
  }
  @Post('sigin')
  sigIn(@Body() user: SigInUserDto) {
    return this.userService.sigIn(user);
  }
}
