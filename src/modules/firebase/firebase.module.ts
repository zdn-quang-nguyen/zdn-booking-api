//
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FirebaseRepository } from './firebase.repository';
import { firebaseProvider } from './firebase.provider';
import { FirebaseController } from './controllers/firebase.controller';
import { FirebaseService } from './services/firebase.service';

@Module({
  imports: [ConfigModule],
  controllers: [FirebaseController],
  providers: [firebaseProvider, FirebaseRepository, FirebaseService],
  exports: [FirebaseRepository],
})
export class FirebaseModule {}
