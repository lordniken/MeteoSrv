import { getRepository } from 'typeorm';

import { NOTIFICATION_TYPES } from '../../constants';
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
    const time = data ? Math.floor(Number(data?.time) / 1000) : '';

    return {
      id: data?.id ?? '',
      type: data?.type ?? '',
      time,
    };
  }
}
