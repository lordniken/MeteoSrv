import { getRepository } from 'typeorm';

import { MeteoController, IMeteoControllerData } from '../MeteoController';
import { Meteo as MeteoEntity } from '../../entities';
import { Sensors } from '../../constants';

export class Meteo {
  private static repository() {
    return getRepository(MeteoEntity);
  }

  static async getMeteoData() {
    const data = await MeteoController.request(
      String(process.env.METEO_CONTROLLER_IP),
      Number(process.env.METEO_CONTROLLER_PORT),
    );

    return MeteoController.parse(data);
  }

  static async store(meteoData: IMeteoControllerData[]) {
    meteoData.forEach(async (data) => {
      const newMeteoData = await Meteo.repository().create(data);

      await Meteo.repository().save(newMeteoData);
    });
  }

  static async getLastSensorsData() {
    const sensors = Object.keys(Sensors)
      .map(Number)
      .filter((value) => !isNaN(value));

    const lastSensorsData = await Promise.all(
      sensors.map(async (sensorId) => {
        const data = await Meteo.repository().findOne({
          where: { sensorId },
          order: { created: 'DESC' },
        });

        return {
          temp: data?.temp,
          humi: data?.humidity,
          update: new Date(data?.created || '').getTime(),
        };
      }),
    );

    return lastSensorsData;
  }
}
