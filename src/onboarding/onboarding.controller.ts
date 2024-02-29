import {
  Controller,
  Body,
  Patch,
  Headers,
  HttpException,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  Get,
} from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import {
  OnboardingStepOne,
  OnboardingStepThree,
  OnboardingStepTwo,
} from './dto/onboarding.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('onboarding')
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Get('step')
  getStatus(@Headers() headers: any) {
    if (!headers.authorization) {
      throw new HttpException('Token needed', HttpStatus.BAD_REQUEST);
    }
    if (headers.authorization.split(' ')[0] != 'Bearer') {
      throw new HttpException('Wrong method', HttpStatus.NOT_ACCEPTABLE);
    }
    const token = headers.authorization.split(' ')[1];

    return this.onboardingService.getStep(token);
  }

  @Patch('one')
  stepOne(
    @Body() onboardingStepOne: OnboardingStepOne,
    @Headers() headers: any,
  ) {
    if (!headers.authorization) {
      throw new HttpException('Token needed', HttpStatus.BAD_REQUEST);
    }
    if (headers.authorization.split(' ')[0] != 'Bearer') {
      throw new HttpException('Wrong method', HttpStatus.NOT_ACCEPTABLE);
    }
    const token = headers.authorization.split(' ')[1];
    return this.onboardingService.stepOne(onboardingStepOne, token);
  }

  @Patch('two')
  stepTwo(
    @Body() onboardingStepTwo: OnboardingStepTwo,
    @Headers() headers: any,
  ) {
    if (!headers.authorization) {
      throw new HttpException('Token needed', HttpStatus.BAD_REQUEST);
    }
    if (headers.authorization.split(' ')[0] != 'Bearer') {
      throw new HttpException('Wrong method', HttpStatus.NOT_ACCEPTABLE);
    }
    const token = headers.authorization.split(' ')[1];
    return this.onboardingService.stepTwo(onboardingStepTwo, token);
  }

  @UseInterceptors(FileInterceptor('audio'))
  @Patch('three')
  stepThree(
    @Headers() headers: any,
    @UploadedFile() audio: Express.Multer.File,
  ) {
    if (!headers.authorization) {
      throw new HttpException('Token needed', HttpStatus.BAD_REQUEST);
    }
    if (headers.authorization.split(' ')[0] != 'Bearer') {
      throw new HttpException('Wrong method', HttpStatus.NOT_ACCEPTABLE);
    }
    const token = headers.authorization.split(' ')[1];

    return this.onboardingService.stepThree(audio, token);
  }
}
