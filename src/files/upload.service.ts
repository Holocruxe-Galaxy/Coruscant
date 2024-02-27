import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';

interface PhotoParams {
  Bucket: string;
  Key: string;
  Body: Buffer;
  ContentType: string;
}

@Injectable()
export class UploadService {
  constructor(
    @Inject(ConfigService)
    private configService: ConfigService,
  ) {}

  private s3Client = new S3Client({
    credentials: {
      accessKeyId: this.configService.getOrThrow('ACCESS_KEY_ID_AWS'),
      secretAccessKey: this.configService.getOrThrow('SECRET_KEY_AWS'),
    },
    region: this.configService.getOrThrow('BUCKET_REGION'),
  });

  async uploadManager(photo: Express.Multer.File, id: string): Promise<string> {
    try {
      const imageName = this.nameFormatter(id, photo.originalname);
      await this.uploadAudio(photo, {
        Bucket: this.configService.getOrThrow('S3_BUCKET_NAME'),
        Key: imageName,
        Body: photo.buffer,
        ContentType: photo.mimetype,
      });
      return imageName;
    } catch (error) {
      console.log(error.message);
    }
  }

  async findOne(imageName: string) {
    const command = new GetObjectCommand({
      Bucket: this.configService.getOrThrow('S3_BUCKET_NAME'),
      Key: imageName,
    });

    const url = await getSignedUrl(this.s3Client, command, {
      expiresIn: 60 * 60 * 2,
    });

    return url;
  }

  private async uploadAudio(audio: Express.Multer.File, params: PhotoParams) {
    const command = new PutObjectCommand(params);
    await this.s3Client.send(command);
  }

  private nameFormatter(id: string, fileName: string) {
    return `audio/${id}_${fileName}_${Date.now()}`;
  }
}
