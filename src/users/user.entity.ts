import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
// import { AplicationData } from './interfaces/aplication-data.interface';
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  username: string;

  @Column({
    nullable: true,
  })
  image_profile_url: string;

  @Column({ nullable: false, unique: true })
  email: string;

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

  //El siguiente código sería la refactorización,
  //se van a agregar los campos para
  //para guardar los datos del Onboarding

  @Column({ nullable: true })
  fullName: string;

  @Column({ nullable: true })
  birthDate: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  gender: string;

  @Column('text', { array: true, nullable: true })
  hobbiesAndPreferences: string[];

  @Column({ nullable: true })
  voiceLegacyName: string;
}
