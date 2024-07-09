import { BaseEntity } from 'src/common/entity/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { SportFieldEntity } from './sport-field.entity';
import { AutoMap } from '@automapper/classes';

@Entity('sport_field_type')
export class SportFieldTypeEntity extends BaseEntity {
  @AutoMap()
  @Column('character varying', { nullable: false })
  name: string;

  @OneToMany(() => SportFieldEntity, (sportField) => sportField.sportFieldType)
  sportFields: SportFieldEntity[];
}
