import { Meteo } from '../services/Meteo';

export const requestStatus = async () => {
  return {
    meteoinfo: await Meteo.getLastSensorsData(),
  };
};
