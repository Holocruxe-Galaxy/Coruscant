import { Module } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { OnboardingController } from './onboarding.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { AudioModule } from 'src/files/uploadFile.module';

@Module({
  imports: [AudioModule, TypeOrmModule.forFeature([User])],
  controllers: [OnboardingController],
  providers: [OnboardingService],
})
export class OnboardingModule {}
