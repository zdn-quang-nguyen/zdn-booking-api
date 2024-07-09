import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

export const firebaseProvider = {
  provide: 'FIREBASE_APP',
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const firebaseConfig = {
      type: configService.get<string>('FIRE_TYPE'),
      project_id: configService.get<string>('FIRE_PROJECT_ID'),
      private_key_id: configService.get<string>('FIRE_PRIVATE_KEY_ID'),
      private_key: configService
        .get<string>('FIRE_PRIVATE_KEY')
        .replace(/\\n/gm, '\n'),
      client_email: configService.get<string>('FIRE_CLIENT_EMAIL'),
      client_id: configService.get<string>('FIRE_CLIENT_ID'),
      auth_uri: configService.get<string>('FIRE_AUTH_URI'),
      token_uri: configService.get<string>('FIRE_TOKEN_URI'),
      auth_provider_x509_cert_url: configService.get<string>(
        'FIRE_AUTH_PROVIDER_X509_CERT_URL',
      ),
      client_x509_cert_url: configService.get<string>(
        'FIRE_CLIENT_X509_CERT_URL',
      ),
      universe_domain: configService.get<string>('FIRE_UNIVERSE_DOMAIN'),
    } as admin.ServiceAccount;
    const projectId = configService.get<string>('FIRE_PROJECT_ID');
    if (!projectId) {
      throw new Error('FIRE_PROJECT_ID is not defined');
    }
    const storageBucketUrl = `${projectId}.appspot.com`;
    if (!storageBucketUrl) {
      throw new Error('storageBucket URL could not be constructed');
    }

    return admin.initializeApp({
      credential: admin.credential.cert(firebaseConfig),
      databaseURL: `https://${firebaseConfig.projectId}.firebaseio.com`,
      storageBucket: storageBucketUrl,
    });
  },
};
