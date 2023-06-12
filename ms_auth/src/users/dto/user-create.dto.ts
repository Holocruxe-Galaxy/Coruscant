import { IsString, IsNotEmpty, IsDateString, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  lastname: string;

  image_profile_url: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsDateString()
  birthdate: Date;
}
