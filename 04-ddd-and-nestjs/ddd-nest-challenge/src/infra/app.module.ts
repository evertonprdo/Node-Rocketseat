import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { envSchema } from './env'
import { EnvModule } from './env/env.module'
import { EnvService } from './env/env.service'

import { AuthModule } from './auth/auth.module'
import { AuthHttpModule } from './http/auth-http.module'
import { AdminHttpModule } from './http/admin-http.module'
import { DeliveryHttpModule } from './http/delivery-http.module'
import { NotificationHttpModule } from './http/notification-http.module'

import { EventsModule } from './events/events.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    EnvModule,
    AuthModule,
    AuthHttpModule,
    AdminHttpModule,
    DeliveryHttpModule,
    NotificationHttpModule,
    EventsModule,
  ],
  providers: [EnvService],
})
export class AppModule {}
