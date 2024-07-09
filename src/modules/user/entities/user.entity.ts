import { AutoMap } from '@automapper/classes';
import { BaseEntity } from 'src/common/entity/base.entity';
import { AccountEntity } from 'src/modules/account/entities/account.entity';
import { BookingEntity } from 'src/modules/booking/entities/booking.entity';
import { SportFieldEntity } from 'src/modules/sport-field/entities/sport-field.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRole {
  user = 'user',
  owner = 'owner',
}

@Entity('user')
export class UserEntity extends BaseEntity {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap()
  @Column({ type: 'character varying', length: 52, nullable: false })
  name: string;

  @AutoMap()
  @Column({
    type: 'character varying',
    length: 320,
    unique: true,
    nullable: false,
  })
  email: string;

  @AutoMap()
  @Column({
    type: 'character varying',
    length: 10,
    unique: true,
    nullable: true,
  })
  phone: string;

  @AutoMap()
  @Column({ type: 'enum', enum: UserRole, nullable: false })
  role: UserRole;

  @AutoMap()
  @Column({ name: 'image_url', type: 'text', nullable: true })
  imageUrl: string;

  @AutoMap()
  @OneToMany(() => AccountEntity, (account) => account.user)
  accounts: AccountEntity[];

  @OneToMany(() => SportFieldEntity, (sportField) => sportField.owner)
  ownedSportFields: SportFieldEntity[];

  @OneToMany(() => BookingEntity, (booking) => booking.createdBy)
  createdBookings: BookingEntity[];

  // @OneToMany(() => BaseEntity, (entity) => entity.createdBy)
  // createdEntities: BaseEntity[];

  // @OneToMany(() => BaseEntity, (entity) => entity.updatedBy)
  // updatedEntities: BaseEntity[];

  // @OneToMany(() => BaseEntity, (entity) => entity.deletedBy)
  // deletedEntities: BaseEntity[];
}
