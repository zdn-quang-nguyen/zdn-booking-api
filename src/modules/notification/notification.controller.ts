import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Res,
  Sse,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { User } from 'src/decorators/user.decorator';
import { ReadUserDTO } from '../user/dto/read-user-dto';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationService } from './notification.service';
import {
  Pagination,
  PaginationParams,
} from 'src/decorators/pagination.decorator';
import { Public } from 'nest-keycloak-connect';
import { MarkAsReadDto } from './dto/mark-as-read.dto';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Public()
  @Sse('events')
  sse(
    @Query() query: { userId: string },
    @Res() response: Response,
  ): Observable<MessageEvent> {
    const userId = query.userId;
    this.notificationService.addUser(userId);
    response.on('close', () => {
      this.notificationService.removeUser(userId);
    });
    return this.notificationService.events(userId);
  }

  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.createNotification(createNotificationDto);
  }

  @Get('me')
  findAll(
    @PaginationParams() paginationParams: Pagination,
    @User() user: ReadUserDTO,
  ) {
    return this.notificationService.findAllUserNotifications(
      user,
      paginationParams,
    );
  }

  @Patch('me/all')
  markAllAsRead(@User() user: ReadUserDTO) {
    return this.notificationService.markAllAsRead(user);
  }

  @Patch('me')
  markAsRead(@User() user: ReadUserDTO, @Body() markAsReadDto: MarkAsReadDto) {
    return this.notificationService.markAsRead(user, markAsReadDto.ids);
  }

  @Get('me/unread/number')
  findAllUnread(@User() user: ReadUserDTO) {
    return this.notificationService.getUnreadNotificationsCount(user);
  }
}
