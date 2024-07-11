// import { MiddlewareConsumer, Module } from '@nestjs/common';
import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import typeorm from './configs/typeorm.config';

import { KeycloakConnectModule } from 'nest-keycloak-connect';
import { keycloakConfig } from './configs/keycloak-connection.config';
import { TYPE_ORM_CONFIG } from './constants/constants';
import { AccountModule } from './modules/account/account.module';
import { AuthModule } from './modules/auth/auth.module';
import { BookingModule } from './modules/booking/booking.module';
import { FieldModule } from './modules/field/field.module';
import { FirebaseModule } from './modules/firebase/firebase.module';
import { LocationModule } from './modules/location/location.module';
import { MailModule } from './modules/mail/mail.module';
import { SportFieldModule } from './modules/sport-field/sport-field.module';
import { UserModule } from './modules/user/user.module';
import { FiltersProvider } from './providers/filters.provider';
import { GuardsProvider } from './providers/guards.provider';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { NotificationModule } from './modules/notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get(TYPE_ORM_CONFIG),
    }),
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    EventEmitterModule.forRoot(),
    KeycloakConnectModule.register(keycloakConfig),
    UserModule,
    AccountModule,
    SportFieldModule,
    FieldModule,
    BookingModule,
    LocationModule,
    MailModule,
    FirebaseModule,
    AuthModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService, ...FiltersProvider, ...GuardsProvider],
})
export class AppModule {}
