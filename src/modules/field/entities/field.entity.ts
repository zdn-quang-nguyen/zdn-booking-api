import { AutoMap } from '@automapper/classes';
import { BaseEntity } from 'src/common/entity/base.entity';
import { BookingEntity } from 'src/modules/booking/entities/booking.entity';
import { SportFieldEntity } from 'src/modules/sport-field/entities/sport-field.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
@Entity('field')
export class FieldEntity extends BaseEntity {
  @AutoMap()
  @Column('character varying', { length: 255 })
  name: string;

  @AutoMap()
  @Column('uuid', { name: 'sport_field_id' })
  sportFieldId: string;

  @AutoMap()
  @ManyToOne(() => SportFieldEntity, (sportField) => sportField.fields, {
    nullable: false,
  })
  @JoinColumn({ name: 'sport_field_id' })
  sportField: SportFieldEntity;

  @AutoMap()
  @OneToMany(() => BookingEntity, (booking) => booking.field)
  bookings: BookingEntity[];
}
