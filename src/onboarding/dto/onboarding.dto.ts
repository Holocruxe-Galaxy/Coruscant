import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsArray,
  ArrayMinSize,
} from 'class-validator';

export class OnboardingStepOne {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsDateString()
  @IsNotEmpty()
  birthDate: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  gender: string;
}

export class OnboardingStepTwo {
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  hobbiesAndPreferences: string[];
}

export class OnboardingStepThree {
  @IsArray()
  voiceLegacy: string;
}
