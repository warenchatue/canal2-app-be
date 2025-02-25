export type EmailType = 'RESET_PASSWORD' | 'REPORT';

export type EmailReceiver = {
  name: string;
  email: string;
};

export type MailEvent = {
  receiver: EmailReceiver;
  type: EmailType;
  data: object;
  subject: string;
};
