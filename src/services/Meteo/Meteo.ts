import { getRepository } from 'typeorm';

import { IMeteoControllerData } from '../MeteoController';
import { Meteo as MeteoEntity } from '../../entities';

export class Meteo {
  static async store(meteoData: IMeteoControllerData[]) {
    const meteoRepository = await getRepository(MeteoEntity);

    meteoData.forEach(async (data) => {
      const newMeteoData = await meteoRepository.create(data);

      await meteoRepository.save(newMeteoData);
    });
  }
}
