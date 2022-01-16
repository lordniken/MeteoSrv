import { getRepository } from 'typeorm';
import { format, utcToZonedTime } from 'date-fns-tz';

import { NOTIFICATION_TYPES, TIMEZONE } from '../../constants';
import { Notifications as NotificationsEntity } from '../../entities';

export class Notification {
  private static get repository() {
    return getRepository(NotificationsEntity);
  }

  static async create(type: NOTIFICATION_TYPES) {
    const notification = await Notification.repository.create({ type });

    await Notification.repository.save(notification);
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
}
