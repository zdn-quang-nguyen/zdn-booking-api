import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from 'src/common/service/base.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationEntity } from './entities/notification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EntitySubscriberInterface,
  In,
  InsertEvent,
  Repository,
} from 'typeorm';
import { ReadUserDTO } from '../user/dto/read-user-dto';
import { UserEntity } from '../user/entities/user.entity';
import { Subject } from 'rxjs';
import { Pagination } from 'src/decorators/pagination.decorator';
import { BaseResponse } from 'src/common/response/base.response';
import { NotificationFilterDto } from './dto/notification-filter.dto';

type EventObject = {
  count: number;
  eventSubject: Subject<MessageEvent>;
};

@Injectable()
export class NotificationService
  extends BaseService<NotificationEntity>
  implements EntitySubscriberInterface<NotificationEntity>
{
  private readonly allSubscribedUsers: Map<string, EventObject> = new Map();

  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    super(notificationRepository);
    this.notificationRepository.manager.connection.subscribers.push(this);
  }
  events(id: string) {
    return this.allSubscribedUsers.get(id).eventSubject.asObservable();
  }

  afterInsert(event: InsertEvent<NotificationEntity>): void | Promise<any> {
    const addedEntity = event.entity;
    if (this.allSubscribedUsers.has(addedEntity.receiver.id))
      this.allSubscribedUsers.get(addedEntity.receiver.id).eventSubject.next({
        data: {
          id: addedEntity.id,
          title: addedEntity.title,
          description: addedEntity.description,
          metadata: addedEntity.metadata,
          isRead: addedEntity.isRead,
          createdAt: addedEntity.createdAt,
        },
      } as MessageEvent);
  }

  addUser(id: string): void {
    if (this.allSubscribedUsers.has(id)) {
      const existing = this.allSubscribedUsers.get(id);
      this.allSubscribedUsers.set(id, {
        ...existing,
        count: existing.count + 1,
      });
    } else {
      this.allSubscribedUsers.set(id, {
        count: 1,
        eventSubject: new Subject<MessageEvent>(),
      });
    }
  }

  removeUser(id: string): void {
    if (this.allSubscribedUsers.has(id)) {
      const existing = this.allSubscribedUsers.get(id);
      if (existing.count === 1) {
        this.allSubscribedUsers.delete(id);
      } else {
        this.allSubscribedUsers.set(id, {
          ...existing,
          count: existing.count - 1,
        });
      }
    }
  }
  async createNotification(createNotificationDto: CreateNotificationDto) {
    const findUser = await this.userRepository.findOne({
      where: { id: createNotificationDto.receiverId },
    });

    if (!findUser) {
      throw new NotFoundException('User not found');
    }

    const notification = {
      ...createNotificationDto,
      receiver: findUser,
      createdBy: findUser.id,
    };
    return this.notificationRepository.save(notification);
  }

  async findAllUserNotifications(
    user: ReadUserDTO,
    paginationParams: Pagination,
    notificationFilterDto: NotificationFilterDto,
  ) {
    const readQuery = notificationFilterDto.read
      ? { isRead: notificationFilterDto.read }
      : {};
    const [notifications, count] =
      await this.notificationRepository.findAndCount({
        where: {
          receiver: { id: user.id },
          ...readQuery,
        },
        take: paginationParams.limit,
        skip: paginationParams.offset,
        order: { createdAt: 'DESC' },
      });

    const totalPage = Math.ceil(count / paginationParams.limit);

    return new BaseResponse(
      notifications,
      'Notifications fetched successfully',
      200,
      new Date().toISOString(),
      totalPage,
    );
  }

  async markAllAsRead(user: ReadUserDTO) {
    return this.notificationRepository.update(
      { receiver: { id: user.id } },
      { isRead: true },
    );
  }

  async markAsRead(user: ReadUserDTO, ids: string[]) {
    return this.notificationRepository.update(
      { id: In(ids), receiver: { id: user.id } },
      { isRead: true },
    );
  }

  async getUnreadNotificationsCount(user: ReadUserDTO) {
    return this.notificationRepository.count({
      where: { receiver: { id: user.id }, isRead: false },
    });
  }
}
