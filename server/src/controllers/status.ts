import { Meteo } from '../services/Meteo';

export const requestStatus = async () => {
  const MOCKED = {
    alarms: {
      id: '',
      type: '',
      time: '',
    },
  };

  return {
    ...MOCKED,
    balance: 0,
    meteoinfo: await Meteo.getLastSensorsData(),
  };
};
