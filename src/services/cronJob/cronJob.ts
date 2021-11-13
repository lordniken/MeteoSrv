import { MeteoController } from '../MeteoController';

export class CronJob {
  static readonly schedule = '1 * * * * *';

  private static async getMeteoData() {
    const controller = new MeteoController(
      String(process.env.METEO_CONTROLLER_IP),
      Number(process.env.METEO_CONTROLLER_PORT),
    );
    const data = await controller.requestData();

    return controller.parseData(data);
  }

  static async run() {
    try {
      const meteoData = await CronJob.getMeteoData();

      console.log(meteoData, new Date());
    } catch (error) {
      console.log('Error while receiving meteo data: ', error);
    }
  }
}
