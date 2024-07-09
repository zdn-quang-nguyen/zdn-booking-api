/* eslint-disable @typescript-eslint/no-unused-vars */
import { AutoMap } from '@automapper/classes';
import { BaseEntity } from 'src/common/entity/base.entity';
import { FieldEntity } from 'src/modules/field/entities/field.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

export enum BookingStatus {
  DISABLED = 'disabled',
  REJECTED = 'rejected',
  AVAILABLE = 'available',
  ACCEPTED = 'accepted',
  BOOKING = 'booking',
}

@Entity('booking') // Specify the table name (optional)
export class BookingEntity extends BaseEntity {
  @AutoMap()
  @Column({ type: 'character varying', length: 10, nullable: true })
  phone: string;

  @AutoMap()
  @Column({ name: 'full_name', type: 'character varying', length: 52 })
  fullName: string;

  @AutoMap()
  @Column('uuid', { name: 'field_id' })
  fieldId: string;

  @AutoMap()
  @ManyToOne(() => FieldEntity, (field) => field.bookings, { nullable: false })
  @JoinColumn({ name: 'field_id' })
  field: FieldEntity;

  @AutoMap()
  @Column({ type: 'timestamp', name: 'start_time' })
  startTime: Date;

  @AutoMap()
  @Column({ type: 'timestamp', name: 'end_time' })
  endTime: Date;

  @AutoMap()
  @Column('float')
  amount: number;

  @AutoMap()
  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.BOOKING,
  })
  status: string;
}
