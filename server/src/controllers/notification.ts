import { Notification } from '../services/Notification';

export const removeNotification = async (id: number) => {
  await Notification.delete(id);
};
