/* eslint-disable @typescript-eslint/no-unused-vars */
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/service/base.service';
import { DateTimeHelper } from 'src/helpers/datetime.helper';
import { FieldEntity } from 'src/modules/field/entities/field.entity';
import { SportFieldEntity } from 'src/modules/sport-field/entities/sport-field.entity';
import { ReadUserDTO } from 'src/modules/user/dto/read-user-dto';
import {
  In,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { CreateOwnerBookingDto } from '../dto/create-owner-booking.dto';
import { ReadingBookingCalendar } from '../dto/read-booking-calendar';
import { ReadBookingDateDTO } from '../dto/read-booking-date.dto';
import { ReadBookingDto } from '../dto/read-booking.dto';
import { ReadOwnerBookingDto } from '../dto/read-owner-booking.dto';
import { UpdateStatusBookingDto } from '../dto/update-status-booking.dto';
import { BookingEntity, BookingStatus } from '../entities/booking.entity';

@Injectable()
export class BookingService extends BaseService<BookingEntity> {
  constructor(
    @InjectRepository(BookingEntity)
    private readonly bookingRepository: Repository<BookingEntity>,
    @InjectRepository(SportFieldEntity)
    private readonly sportFieldRepository: Repository<SportFieldEntity>,
    @InjectRepository(FieldEntity)
    private readonly fieldRepository: Repository<FieldEntity>,
    @InjectMapper()
    public readonly mapper: Mapper,
  ) {
    super(bookingRepository);
  }

  private async validateFieldExists(fieldId: string): Promise<FieldEntity> {
    const field = await this.fieldRepository.findOne({
      where: { id: fieldId },
    });
    if (!field) {
      throw new NotFoundException('Field not found');
    }
    return field;
  }

  async isBookingTimeInvalid(fieldId: string, startTime: Date, endTime: Date) {
    await this.validateFieldExists(fieldId);

    const field = await this.fieldRepository.findOne({
      where: { id: fieldId },
      relations: {
        sportField: true,
      },
    });

    const sportField = field.sportField;
    const startTimeString = new Date(startTime).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h24',
    });
    const endTimeString = new Date(endTime).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h24',
    });

    const compareStartTime = DateTimeHelper.compareTimes(
      startTimeString,
      sportField.startTime,
    );

    const compareEndTime = DateTimeHelper.compareTimes(
      endTimeString,
      sportField.endTime,
    );
    return compareStartTime === -1 || compareEndTime === 1;
  }

  async hasBookingTime(fieldId: string, startTime: Date, endTime: Date) {
    const booking = await this.bookingRepository
      .createQueryBuilder('booking')
      .where('booking.field = :fieldId', { fieldId })
      .andWhere(
        "booking.startTime < :endTime at time zone '-07' AND booking.endTime > :startTime  at time zone '-07'",
        {
          startTime,
          endTime,
        },
      )
      .andWhere('booking.status = :status', {
        status: BookingStatus.ACCEPTED,
      })
      .getOne();

    return !!booking;
  }

  async validateBookingTime(fieldId: string, startTime: Date, endTime: Date) {
    if (await this.isBookingTimeInvalid(fieldId, startTime, endTime)) {
      throw new BadRequestException('Invalid booking time');
    }

    if (await this.hasBookingTime(fieldId, startTime, endTime)) {
      throw new ConflictException('There is a booking at this time');
    }

    if (DateTimeHelper.isInPast(startTime)) {
      throw new BadRequestException('Invalid booking time');
    }
  }

  async createBooking(user: ReadUserDTO, createBookingDto: CreateBookingDto) {
    const { fieldId, ...bookingDetails } = createBookingDto;
    const field = await this.validateFieldExists(fieldId);
    await this.validateBookingTime(
      fieldId,
      bookingDetails.startTime,
      bookingDetails.endTime,
    );

    const { id, ...userInfo } = user;
    const newBooking = await this.bookingRepository.save({
      ...userInfo,
      ...bookingDetails,
      status: BookingStatus.BOOKING,
      field,
      fullName: user.name,
      createdBy: user.id,
      updatedBy: user.id,
    });

    return newBooking;
  }

  async createBookingByOwner(
    user: ReadUserDTO,
    createBookingDto: CreateOwnerBookingDto,
  ) {
    const { fieldId, ...bookingDetails } = createBookingDto;
    await this.validateFieldExists(fieldId);
    await this.validateFieldAccess(user.id, fieldId);
    await this.validateBookingTime(
      fieldId,
      bookingDetails.startTime,
      bookingDetails.endTime,
    );

    const field = await this.fieldRepository.findOne({
      where: { id: fieldId },
    });
    return await this.bookingRepository.save({
      ...bookingDetails,
      status: createBookingDto.status ?? BookingStatus.BOOKING,
      field,
      fullName: createBookingDto.name,
      phoneNumber: createBookingDto.phone,
      createdBy: user.id,
      updatedBy: user.id,
    });
  }

  private async validateFieldAccess(
    userId: string,
    fieldId: string,
  ): Promise<void> {
    const field = await this.fieldRepository.findOne({
      where: { id: fieldId },
    });

    await this.validateFieldExists(fieldId);

    if (field.createdBy !== userId) {
      throw new ForbiddenException(
        'You do not have permission to view bookings',
      );
    }
  }

  private buildBaseQuery(readBookingDto: ReadOwnerBookingDto | ReadBookingDto) {
    const query = this.bookingRepository
      .createQueryBuilder('booking')
      .innerJoinAndSelect('booking.field', 'field');

    if ('fieldId' in readBookingDto) {
      query.where('field.id = :fieldId', {
        fieldId: readBookingDto.fieldId,
      });
    }

    if (readBookingDto.startTime && readBookingDto.endTime) {
      query
        .andWhere("booking.startTime >= :startTime at time zone '-07'", {
          startTime: readBookingDto.startTime,
        })
        .andWhere("booking.endTime <= :endTime at time zone '-07'", {
          endTime: readBookingDto.endTime,
        });
    }

    return query;
  }

  private applyStatusFilter(
    query: SelectQueryBuilder<BookingEntity>,
    status?: string[],
  ) {
    if (status && status.length > 0) {
      query.andWhere('booking.status IN (:...status)', { status });
    }
  }

  async getBookingsByFieldId(
    user: ReadUserDTO,
    readBookingDto: ReadOwnerBookingDto,
  ) {
    this.validateFieldAccess(user.id, readBookingDto.fieldId);
    const query = this.buildBaseQuery(readBookingDto);
    this.applyStatusFilter(query, readBookingDto.status);
    return await query.getMany();
  }

  async getUserBooking(user: ReadUserDTO, readBookingDto: ReadBookingDto) {
    const query = this.buildBaseQuery(readBookingDto);
    query.andWhere('booking.createdBy = :userId', { userId: user.id });

    this.applyStatusFilter(query, readBookingDto.status);

    return query.getMany();
  }

  async getOwnerSchedule(user: ReadUserDTO, filter?: any) {
    const query = this.bookingRepository.createQueryBuilder('booking');

    if (filter.fieldId) {
      query.where('booking.fieldId = :fieldId', { fieldId: filter.fieldId });
    }

    query
      .innerJoinAndSelect('booking.field', 'field')
      .innerJoinAndSelect('field.sportField', 'sportField')
      .innerJoinAndSelect('sportField.sportFieldType', 'sportFieldType')
      .orderBy('booking.startTime', 'DESC');

    query.where('sportField.ownerId = :userId', { userId: user.id });
    if (filter.status) {
      this.applyStatusFilter(query, filter.status);
    }
    return query.getMany();
  }

  async getTransaction(userId: string, filter?: any) {
    const query = this.bookingRepository
      .createQueryBuilder('booking')
      .innerJoinAndSelect('booking.field', 'field')
      .innerJoinAndSelect('field.sportField', 'sportField')
      .innerJoinAndSelect('sportField.sportFieldType', 'sportFieldType')
      .orderBy('booking.startTime', 'DESC');

    if (userId) {
      query.where('sportField.ownerId = :userId', { userId });
    }

    if (
      filter.type !== 'all' &&
      filter.type !== undefined &&
      filter.type !== '' &&
      filter.type !== null
    ) {
      query.andWhere('sportFieldType.id = :type', { type: filter.type });
    }

    if (filter) {
      if (filter.status === 'all') {
        query.andWhere('booking.status != :status', {
          status: BookingStatus.BOOKING,
        });
      } else {
        query.andWhere('booking.status = :status', { status: filter.status });
      }

      if (filter.date !== undefined) {
        query.andWhere("DATE(booking.start_time AT TIME ZONE 'UTC+7') = :day", {
          day: filter.date,
        });
      }

      if (filter.startTime && filter.endTime) {
        query.andWhere("TO_CHAR(booking.start_time, 'HH24:MI') >= :startTime", {
          startTime: filter.startTime,
        });
        query.andWhere("TO_CHAR(booking.start_time, 'HH24:MI') <= :endTime", {
          endTime: filter.endTime,
        });
        query.andWhere("TO_CHAR(booking.end_time, 'HH24:MI') <= :endTime", {
          endTime: filter.endTime,
        });
      }
    }

    if (
      filter.name !== null &&
      filter.name !== undefined &&
      filter.name !== ''
    ) {
      console.log(filter.name);
      query.andWhere('booking.fullName ILIKE :name', {
        name: `%${filter.name}%`,
      });
    }

    const total = await query.getCount();

    if (filter.page > 0) {
      query.skip((filter.page - 1) * 15);
      query.take(15);
    }

    const data = await query.getMany();
    console.log({ data, total });

    return {
      data,
      total,
    };
  }

  async getOwnerBooking(uid: string, status: string, page: number) {
    // const bookings = this.bookingRepository.find({
    //   where: { field.sportField.owner: owner.id },
    //   relations: ['field', 'field.sportField'],
    // });
    //
    const filter = {
      type: 'all',
      status: status,
      date: undefined,
      startTime: undefined,
      endTime: undefined,
      name: undefined,
      page: page,
    };
    const bookings = await this.getTransaction(uid, filter);

    // return this.mapper(bookings, BookingEntity, ReadBookingDto);
    return bookings;
  }

  async remove(id: string, user: ReadUserDTO) {
    const booking = await this.bookingRepository.findOne({
      where: {
        id,
      },
      relations: {
        field: true,
      },
    });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    if (booking.field.createdBy !== user.id) {
      throw new ForbiddenException(
        'You do not have permission to delete this booking',
      );
    }
    booking.deletedBy = user.id;
    await this.bookingRepository.save(booking);
    await this.bookingRepository.softDelete(id);

    return {
      statusCode: 200,
      status: 'Success',
      message: 'Deleted successfully',
    };
  }
  async removeBookingOfSportField(id: string, user: ReadUserDTO) {
    const sportField = await this.sportFieldRepository.find({
      where: { id: id },
    });

    if (sportField.length === 0) {
      return {
        statusCode: 404,
        status: 'Error',
        message: 'Sport field not exists',
      };
    }
    if (sportField[0].createdBy !== user.id) {
      return {
        statusCode: 403,
        status: 'Error',
        message:
          'You do not have permission to delete  bookings of this  sport field',
      };
    }
    const fields = await this.fieldRepository.find({
      where: { sportField: { id: id } },
    });
    const fieldIds = fields.map((field) => field.id);
    console.log(fieldIds);
    await this.bookingRepository
      .createQueryBuilder()
      .delete()
      .where('field_id IN (:...fieldIds)', { fieldIds })
      .execute();

    return {
      statusCode: 200,
      status: 'Success',
      message: 'Deleted successfully',
    };
  }

  async getBookingsBySportFieldId(id: string) {
    const sportField = await this.sportFieldRepository.findOne({
      where: { id: id },
    });
    if (!sportField) {
      return {
        statusCode: 404,
        status: 'Error',
        message: 'Sport field not exists',
      };
    }
    const fields = await this.fieldRepository.find({
      where: { sportField: { id: id } },
    });
    const fieldIds = fields.map((field) => field.id);
    const bookings = await this.bookingRepository.find({
      where: { field: { id: In(fieldIds) } },
      relations: {
        field: true,
      },
    });
    console.log(bookings);
    return bookings;
  }
  async updateStatusBooking(
    id: string,
    data: UpdateStatusBookingDto,
    user: ReadUserDTO,
  ) {
    const booking = await this.bookingRepository.findOne({
      where: {
        id,
      },
      relations: ['field', 'field.sportField'],
    });
    if (!booking) {
      return {
        statusCode: 404,
        status: 'Error',
        message: 'Booking not exists',
      };
    }
    if (booking.field.sportField.ownerId !== user.id) {
      return {
        statusCode: 403,
        status: 'Error',
        message: 'You do not have permission to update this booking',
      };
    }
    await this.bookingRepository.update(id, data);
    return {
      statusCode: 200,
      status: 'Success',
      message: 'Updated successfully',
    };
  }

  async updateBooking(
    id: string,
    data: Partial<BookingEntity>,
    user: ReadUserDTO,
  ) {
    const booking = await this.bookingRepository.findOne({
      where: {
        id,
      },
      relations: ['field', 'field.sportField'],
    });
    if (!booking) {
      return {
        statusCode: 404,
        status: 'Error',
        message: 'Booking not exists',
      };
    }
    if (booking.field.sportField.ownerId !== user.id) {
      return {
        statusCode: 403,
        status: 'Error',
        message: 'You do not have permission to update this booking',
      };
    }
    const res = await this.bookingRepository.update(id, data);
    if (res.affected === 0)
      return {
        statusCode: 400,
        status: 'Failed',
        message: 'Updated failed',
      };
    return {
      statusCode: 200,
      status: 'Success',
      message: 'Updated successfully',
    };
  }

  async getBookingsCalendarWeek(
    id: string,
    startOfWeek: Date,
    endOfWeek: Date,
    dailyStartTime: string,
    dailyEndTime: string,
  ): Promise<ReadingBookingCalendar[][]> {
    const weeklyData: ReadingBookingCalendar[][] = [];
    const currentDate = new Date(startOfWeek);
    console.log(currentDate);
    while (currentDate <= new Date(endOfWeek)) {
      console.log(currentDate.getHours());
      const startTime = new Date(currentDate);
      const time = parseInt(dailyStartTime.split(':')[0], 10);
      startTime.setHours(time);
      console.log(startTime);

      startTime.setMinutes(parseInt(dailyStartTime.split(':')[1]));
      const endTime = new Date(currentDate);
      endTime.setHours(parseInt(dailyEndTime.split(':')[0], 10));
      endTime.setMinutes(parseInt(dailyEndTime.split(':')[1], 10));

      const timeSlots = [];
      let currentTime = new Date(startTime);
      const endTimeOfDay = new Date(endTime);
      while (currentTime < endTimeOfDay) {
        timeSlots.push(new Date(currentTime));
        currentTime = new Date(currentTime.getTime() + 30 * 60000);
      }

      const fields = await this.fieldRepository.find({
        where: { sportField: { id: id } },
      });

      const fieldIds = fields.map((field) => field.id);

      const results = await Promise.all(
        timeSlots.map(async (slot) => {
          const bookings = await this.bookingRepository.find({
            where: {
              field: { id: In(fieldIds) },
              status: BookingStatus.ACCEPTED,
              startTime: LessThanOrEqual(slot),
              endTime: MoreThanOrEqual(new Date(slot.getTime() + 30 * 60000)),
            },
          });

          const isEmpty = bookings.length === 0;

          return {
            startTime: slot,
            endTime: new Date(slot.getTime() + 30 * 60000),
            isEmpty: isEmpty,
          };
        }),
      );

      console.log(currentDate);

      weeklyData.push(results);

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return weeklyData;
  }
  async getBookingById(id: string) {
    const booking = await this.bookingRepository.findOne({
      where: { id: id },
    });
    console.log(123, booking);
    if (!booking) {
      return {
        statusCode: 404,
        status: 'Error',
        message: 'Booking not exists',
      };
    }
    return {
      statusCode: 200,
      status: 'Success',
      message: 'Booking found',
      data: booking,
    };
  }
}
