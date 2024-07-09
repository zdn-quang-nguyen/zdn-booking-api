import { BaseEntity } from 'src/common/entity/base.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

export enum AccountType {
  manual = 'manual',
  is_google = 'is_google',
  is_facebook = 'is_facebook',
}
@Entity('account')
export class AccountEntity extends BaseEntity {
  @Column({ type: 'enum', enum: AccountType, nullable: false })
  name: AccountType;

  @ManyToOne(() => UserEntity, (user) => user.accounts, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
