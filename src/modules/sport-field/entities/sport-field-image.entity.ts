import { BaseEntity } from 'src/common/entity/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { SportFieldEntity } from './sport-field.entity';
import { AutoMap } from '@automapper/classes';

@Entity('sport_field_image')
export class SportFieldImageEntity extends BaseEntity {
  @AutoMap()
  @Column('character varying', { nullable: false, length: 255 })
  name: string;

  @AutoMap()
  @Column({ nullable: false })
  url: string;

  @AutoMap()
  @Column('uuid', { name: 'sport_field_id', nullable: false })
  sportFieldId: string;

  @AutoMap()
  @ManyToOne(
    () => SportFieldEntity,
    (sportField) => sportField.sportFieldImages,
  )
  @JoinColumn({ name: 'sport_field_id' })
  sportField: SportFieldEntity;
}
