import { AutoMap } from '@automapper/classes';
import { BaseEntity } from 'src/common/entity/base.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('notification')
export class NotificationEntity extends BaseEntity {
  @AutoMap()
  @Column({ type: 'character varying', nullable: false, length: 255 })
  title: string;

  @AutoMap()
  @Column({ type: 'character varying', nullable: true, length: 255 })
  description: string;

  @AutoMap()
  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @AutoMap()
  @ManyToOne(() => UserEntity, (user) => user.notifications)
  @JoinColumn({ name: 'receiver_id' })
  receiver: UserEntity;

  @AutoMap()
  @Column({ name: 'is_read', type: 'boolean', nullable: true, default: false })
  isRead: boolean;
}
