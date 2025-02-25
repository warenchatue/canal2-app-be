import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailReceiver, MailEvent } from './types/email.type';

@Injectable()
export class EmailService {
  private readonly logger: Logger = new Logger(EmailService.name);

  constructor(
    private readonly mailService: MailerService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async resetPasswordMail(user: EmailReceiver, password: string) {
    const payload: MailEvent = {
      receiver: user,
      data: {
        password,
      },
      subject: 'Reinitialisation du mot de passe',
      type: 'RESET_PASSWORD',
    };
    this.eventEmitter.emit('send.email', payload);
  }

  @OnEvent('send.email')
  async performSend(payload: MailEvent) {
    let template = 'report';

    if (payload.type === 'RESET_PASSWORD') {
      template = 'reset-password';
    }

    const to =
      payload.receiver.name.trim().length <= 0
        ? payload.receiver.email
        : {
            name: payload.receiver.name,
            address: payload.receiver.email,
          };

    await this.mailService
      .sendMail({
        from: {
          name: process.env.EMAIL_FROM_NAME,
          address: process.env.EMAIL_FROM_EMAIL,
        },
        to,
        subject: payload.subject,
        template,
        context: payload.data,
      })
      .then(
        (value) => {
          this.logger.log(value);
        },
        (reason) => {
          this.logger.error(reason);
        },
      );
  }
}
