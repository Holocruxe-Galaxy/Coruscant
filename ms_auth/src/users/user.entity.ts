import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
// import { AplicationData } from './interfaces/aplication-data.interface';
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ nullable: false })
  username: string;
  @Column({ nullable: false })
  name: string;
  @Column({ nullable: false })
  lastname: string;
  @Column({
    default:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7rknxUtwx7q1VXuXZdNEGKaUJ6gFodh-rcw&usqp=CAU',
    nullable: true,
  })
  image_profile_url: string;
  @Column({ nullable: false, unique: true })
  email: string;
  @Column({ type: 'date', nullable: false })
  birthdate: Date;
  @Column({ default: false })
  admin: boolean;
  @Column({ default: false })
  ban: boolean;
  @Column({ default: false })
  premium: boolean;
  @Column({
    name: 'created_at',
    type: 'timestamp',
    nullable: false,
    default: () => 'now()',
  })
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @Column({ nullable: true })
  last_connection: Date;
  // @Column('json')
  // aplication_data: AplicationData;
}
