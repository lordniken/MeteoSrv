import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Meteo {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('numeric')
  sensorId: number;

  @Column('numeric')
  temp: number;

  @Column('numeric', { default: null })
  humidity: number | null;

  @CreateDateColumn()
  created: Date;
}
