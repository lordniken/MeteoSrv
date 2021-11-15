import { format, zonedTimeToUtc } from 'date-fns-tz';

import { Meteo } from '../services/Meteo';

export const requestChart = async (
  date1: string,
  date2: string,
  sensorId: number,
) => {
  const [startDay, startMonth, startYear] = date1.split('.');
  const [endDay, endMonth, endYear] = date2.split('.');
  const startDate = zonedTimeToUtc(
    new Date(Number(startYear), Number(startMonth) - 1, Number(startDay), 0, 0),
    'Europe/Moscow',
  );
  const endDate = zonedTimeToUtc(
    new Date(Number(endYear), Number(endMonth) - 1, Number(endDay), 23, 59),
    'Europe/Moscow',
  );
  const chartData = await Meteo.getChartData(startDate, endDate, sensorId);

  return chartData.map((data) => ({
    temp: data.temp,
    humi: data.humidity || 0, // mobile app crashes if return null :-(
    time: format(data.created, 'dd.MM.yyyy - HH:mm', {
      timeZone: 'Europe/Moscow',
    }),
  }));
};
