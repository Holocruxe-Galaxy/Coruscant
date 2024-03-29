import { IsEmail, IsNotEmpty } from 'class-validator';
export class SigInUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
