import { getRepository } from 'typeorm';
import { format, utcToZonedTime } from 'date-fns-tz';
import { Telegraf } from 'telegraf';
import { createTransport } from 'nodemailer';

import {
  NOTIFICATION_SERVICES,
  NOTIFICATION_TYPES,
  TIMEZONE,
} from '../../constants';
import { Notifications as NotificationsEntity } from '../../entities';

export class Notification {
  private static get repository() {
    return getRepository(NotificationsEntity);
  }

  static async create(
    services: Array<NOTIFICATION_SERVICES>,
    type: NOTIFICATION_TYPES,
  ) {
    services.forEach((service) => {
      Notification[service](type);
    });
  }

  static async delete(id: number) {
    await Notification.repository.delete({ id });
  }

  static async get() {
    const data = await Notification.repository.findOne({
      order: { time: 'DESC' },
    });
    // Mobile app requires strings instead of null :-(
    const time = data
      ? format(utcToZonedTime(data.time, TIMEZONE), 'dd.MM.yyyy - HH:mm', {
          timeZone: TIMEZONE,
        })
      : '';

    return {
      id: data?.id ?? '',
      type: data?.type ?? '',
      time,
    };
  }

  private static getNotificationMessage(type: NOTIFICATION_TYPES) {
    switch (type) {
      case NOTIFICATION_TYPES.sensors:
        return `Температура вышла за пределы допустимых значений!\n\nВремя обнаружения: ${new Date().toLocaleString()}`;
      case NOTIFICATION_TYPES.timeout:
        return `Нет информация от датчиков!\n\nВремя обнаружения: ${new Date().toLocaleString()}`;
    }
  }

  static async app(type: NOTIFICATION_TYPES) {
    const notification = await Notification.repository.create({ type });

    await Notification.repository.save(notification);
  }

  static async email(type: NOTIFICATION_TYPES) {
    const smtpTransport = createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      auth: {
        user: process.env.EMAIL_LOGIN,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    smtpTransport.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: 'Уведомление от метео сервера',
      text: Notification.getNotificationMessage(type),
    });
  }

  static async telegram(type: NOTIFICATION_TYPES) {
    const bot = new Telegraf(String(process.env.TELEGRAM_TOKEN));

    bot.telegram.sendMessage(
      Number(process.env.TELEGRAM_CHANEL_ID),
      Notification.getNotificationMessage(type),
    );
  }
}
