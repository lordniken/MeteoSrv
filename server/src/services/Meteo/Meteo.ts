import { Between, getRepository } from 'typeorm';

import { MeteoController, IMeteoControllerData } from '../MeteoController';
import { Meteo as MeteoEntity } from '../../entities';
import { Sensors, ExtremeValues } from '../../constants';

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
      if (
        data.temp > ExtremeValues.minimumTemp &&
        data.temp < ExtremeValues.maximumTemp
      ) {
        const newMeteoData = await Meteo.repository().create(data);

        await Meteo.repository().save(newMeteoData);
      }
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
        const update = Math.floor(Number(data?.created) / 1000);

        return {
          temp: data?.temp,
          humi: data?.humidity,
          update,
        };
      }),
    );

    return lastSensorsData;
  }

  static async getChartData(
    startDate: Date,
    endDate: Date,
    sensorId: number,
  ): Promise<MeteoEntity[]> {
    const data = await Meteo.repository().find({
      where: {
        created: Between(startDate, endDate),
        sensorId,
      },
    });

    return data;
  }
}
