import { Meteo } from '../Meteo';
import { Alarm } from '../Alarm';

export class CronJob {
  static readonly schedule = '*/5 * * * *';

  static async run() {
    try {
      const data = await Meteo.getMeteoData();

      Meteo.store(data);
    } catch (error) {
      console.log('Error while receiving meteo data: ', error);
    }

    Alarm.check();
  }
}
