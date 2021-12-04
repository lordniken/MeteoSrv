import { Meteo } from '../services/Meteo';
import { Notification } from '../services/Notification';

export const requestStatus = async () => {
  return {
    alarms: await Notification.get(),
    balance: 0,
    meteoinfo: await Meteo.getLastSensorsData(),
  };
};
