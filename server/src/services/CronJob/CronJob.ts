import { Meteo } from '../Meteo';

export class CronJob {
  static readonly schedule = '1 * * * * *';

  static async run() {
    try {
      const data = await Meteo.getMeteoData();

      Meteo.store(data);
    } catch (error) {
      console.log('Error while receiving meteo data: ', error);
    }
  }
}
