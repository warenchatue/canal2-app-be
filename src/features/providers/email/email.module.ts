import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EmailService } from './email.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        from: {
          name: process.env.EMAIL_FROM_NAME,
          address: process.env.EMAIL_FROM_EMAIL,
        },
        host: process.env.EMAIL_HOST,
        port: Number.parseInt(process.env.EMAIL_PORT),
        secure: process.env.MAIL_SECURE == 'true',
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
      template: {
        adapter: new EjsAdapter(),
        options: {
          strict: false,
        },
        dir: __dirname + '/../../../templates/emails',
      },
    }),
    EventEmitterModule.forRoot(),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
