import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { LocationEntity } from './location.entity';

@Entity('province')
export class ProvinceEntity {
  @PrimaryColumn({ type: 'text' })
  id: string;

  @Column({ type: 'text' })
  name: string;

  @OneToMany(() => LocationEntity, (location) => location.province)
  locations: LocationEntity[];
}
