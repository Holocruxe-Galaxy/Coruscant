import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import * as dotenv from 'dotenv';
import { ConfigModule } from '@nestjs/config';
dotenv.config();
const { DB_HOST, DB_USER, DB_NAME, DB_PASSWORD, PRODUCTION } = process.env;
console.log(DB_HOST);

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      logging: !Boolean(PRODUCTION),
      type: 'postgres',
      host: DB_HOST,
      port: 5432,
      username: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: !Boolean(PRODUCTION),
    }),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
