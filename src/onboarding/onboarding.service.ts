import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import {
  OnboardingStepOne,
  OnboardingStepThree,
  OnboardingStepTwo,
} from './dto/onboarding.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { UploadService } from 'src/files/upload.service';

@Injectable()
export class OnboardingService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @Inject(UploadService)
    private uploadService: UploadService,
  ) {}
  private readonly JWT_SECRET = process.env.JWT_SECRET;

  async stepOne(onboardingStepOne: OnboardingStepOne, token: string) {
    let decodedToken: { [x: string]: any; id?: any };
    try {
      decodedToken = jwt.verify(token, this.JWT_SECRET) as {
        [key: string]: any;
      };
    } catch (error) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    let user = await this.userRepository.findOne({
      where: { id: decodedToken.id },
    });
    if (user) {
      user = {
        ...user,
        fullName: onboardingStepOne.fullName,
        birthDate: onboardingStepOne.birthDate,
        country: onboardingStepOne.country,
      };
      await this.userRepository.save(user);
      return 'The account was modified correctly';
    } else {
      throw new HttpException(
        'The account was not found',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async stepTwo(onboardingStepTwo: OnboardingStepTwo, token: string) {
    let decodedToken: { [x: string]: any; id?: any };
    try {
      decodedToken = jwt.verify(token, this.JWT_SECRET) as {
        [key: string]: any;
      };
    } catch (error) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    let user = await this.userRepository.findOne({
      where: { id: decodedToken.id },
    });
    if (user) {
      user = {
        ...user,
        hobbiesAndPreferences: onboardingStepTwo.hobbiesAndPreferences,
      };
      await this.userRepository.save(user);
      return 'The account was modified correctly';
    } else {
      throw new HttpException(
        'The account was not found',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async stepThree(audio: Express.Multer.File, token: string) {
    let decodedToken: { [x: string]: any; id?: any };
    try {
      decodedToken = jwt.verify(token, this.JWT_SECRET) as {
        [key: string]: any;
      };
    } catch (error) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    let user = await this.userRepository.findOne({
      where: { id: decodedToken.id },
    });
    if (!audio) {
      user = {
        ...user,
        voiceLegacy: 'omitted',
      };
      await this.userRepository.save(user);
      return 'The account was modified correctly';
    }
    if (user) {
      const imageName = await this.uploadService.uploadManager(audio, user.id);
      user = {
        ...user,
        voiceLegacy: imageName,
      };
      await this.userRepository.save(user);
      return 'The account was modified correctly';
    } else {
      throw new HttpException(
        'The account was not found',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async getStep(token: string) {
    let decodedToken: { [x: string]: any; id?: any };
    try {
      decodedToken = jwt.verify(token, this.JWT_SECRET) as {
        [key: string]: any;
      };
    } catch (error) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    let user = await this.userRepository.findOne({
      where: { id: decodedToken.id },
    });

    if (!user.fullName && !user.birthDate && !user.country) {
      console.log(user.hobbiesAndPreferences);
      return {
        status: 'PENDING',
        step: 1,
      };
    }
    if (
      user.fullName &&
      user.birthDate &&
      user.country &&
      !user.hobbiesAndPreferences
    ) {
      return {
        status: 'PENDING',
        step: 2,
      };
    }
    if (
      user.fullName &&
      user.birthDate &&
      user.country &&
      user.hobbiesAndPreferences &&
      !user.voiceLegacy
    ) {
      return {
        status: 'PENDING',
        step: 3,
      };
    }
    if (
      user.fullName &&
      user.birthDate &&
      user.country &&
      user.hobbiesAndPreferences &&
      user.voiceLegacy
    ) {
      return {
        status: 'COMPLETE',
      };
    }
  }
}
