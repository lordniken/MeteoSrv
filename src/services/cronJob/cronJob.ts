import { MeteoController } from '../MeteoController';
import { Meteo } from '../Meteo';

export class CronJob {
  static readonly schedule = '1 * * * * *';

  private static async getMeteoData() {
    const data = await MeteoController.request(
      String(process.env.METEO_CONTROLLER_IP),
      Number(process.env.METEO_CONTROLLER_PORT),
    );

    return MeteoController.parse(data);
  }

  static async run() {
    try {
      const data = await CronJob.getMeteoData();

      Meteo.store(data);
    } catch (error) {
      console.log('Error while receiving meteo data: ', error);
    }
  }
}
