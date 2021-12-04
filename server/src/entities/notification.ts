import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Notifications {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('numeric')
  type: number;

  @CreateDateColumn({ type: 'timestamptz' })
  time: Date;
}
