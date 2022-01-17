import { Meteo } from '../Meteo';
import { IMeteoControllerData } from '../MeteoController';
import { IReadSettings, Settings } from '../Settings';
import { Notification } from '../Notification';
import { NOTIFICATION_SERVICES, NOTIFICATION_TYPES } from '../../constants';

const SECONDS_IN_MINUTE = 60;
const SECONDS_IN_HOUR = SECONDS_IN_MINUTE * 60;

type MeteoType = Partial<IMeteoControllerData> & { update: number };

export class Alarm {
  private static lastAlarm = 0;
  private static get settings() {
    return Settings.read();
  }
  private static get datetime() {
    return new Date().getTime() / 1000;
  }

  private static isCriticalTemperature(
    data: MeteoType,
    settings: IReadSettings,
  ) {
    const min = Number(settings[`d${data.sensorId}min`]);
    const max = Number(settings[`d${data.sensorId}max`]);

    return data.temp && (data.temp >= max || data.temp <= min);
  }

  private static isTimeoutAlarm(data: MeteoType, timeout: number) {
    const secondsFromLastUpdate = new Date().getTime() / 1000 - data.update;

    return secondsFromLastUpdate > SECONDS_IN_HOUR * timeout;
  }

  private static isAlarmAvailable(timeout: number) {
    const alarmDelay = SECONDS_IN_MINUTE * timeout;
    const isAvailableByTimeout = Alarm.datetime > Alarm.lastAlarm + alarmDelay;

    return isAvailableByTimeout;
  }

  static async check() {
    const settings = await Alarm.settings;

    if (Alarm.isAlarmAvailable(settings.tbtwnalarms)) {
      const data = await Meteo.getLastSensorsData();
      const [lastSensorData] = data;

      data.forEach((meteo) => {
        if (Alarm.isCriticalTemperature(meteo, settings)) {
          Notification.create(
            [
              NOTIFICATION_SERVICES.app,
              NOTIFICATION_SERVICES.email,
              NOTIFICATION_SERVICES.telegram,
            ],
            NOTIFICATION_TYPES.sensors,
          );

          Alarm.lastAlarm = Alarm.datetime;
        }
      });

      if (Alarm.isTimeoutAlarm(lastSensorData, settings.timeout)) {
        Notification.create(
          [
            NOTIFICATION_SERVICES.app,
            NOTIFICATION_SERVICES.email,
            NOTIFICATION_SERVICES.telegram,
          ],
          NOTIFICATION_TYPES.timeout,
        );

        Alarm.lastAlarm = Alarm.datetime;
      }
    }
  }
}
