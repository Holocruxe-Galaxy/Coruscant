import { IsString, IsNotEmpty, IsEmail, IsUrl } from 'class-validator';

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
  birthdate: Date;
}
