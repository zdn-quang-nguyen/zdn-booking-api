import { BaseEntity } from 'src/common/entity/base.entity';
import { SportFieldEntity } from 'src/modules/sport-field/entities/sport-field.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { DistrictEntity } from './district.entity';
import { ProvinceEntity } from './province.entity';
import { WardEntity } from './ward.entity';
import { AutoMap } from '@automapper/classes';

@Entity('location')
export class LocationEntity extends BaseEntity {
  @AutoMap()
  @Column({ name: 'sport_field_id', type: 'uuid' })
  sportFieldId: string;

  @AutoMap()
  @OneToOne(() => SportFieldEntity, (sportField) => sportField.location)
  @JoinColumn({ name: 'sport_field_id' })
  sportField: SportFieldEntity;

  @AutoMap()
  @Column({ name: 'province_id', type: 'uuid' })
  provinceId: string;

  @AutoMap()
  @ManyToOne(() => ProvinceEntity, (province) => province.locations)
  @JoinColumn({ name: 'province_id' })
  province: ProvinceEntity;

  @AutoMap()
  @Column({ name: 'district_id', type: 'uuid' })
  districtId: string;

  @AutoMap()
  @ManyToOne(() => DistrictEntity, (district) => district.locations)
  @JoinColumn({ name: 'district_id' })
  district: DistrictEntity;

  @AutoMap()
  @Column({ name: 'ward_id', type: 'uuid' })
  wardId: string;

  @AutoMap()
  @ManyToOne(() => WardEntity, (ward) => ward.locations)
  @JoinColumn({ name: 'ward_id' })
  ward: WardEntity;

  @AutoMap()
  @Column({ name: 'address_detail', type: 'character varying', length: 255 })
  addressDetail: string;

  @AutoMap()
  @Column('float', { nullable: true })
  longitude: number;

  @AutoMap()
  @Column('float', { nullable: true })
  latitude: number;
}
