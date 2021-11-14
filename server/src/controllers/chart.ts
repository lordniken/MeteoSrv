import { Meteo } from '../services/Meteo';

export const requestChart = async (
  date1: string,
  date2: string,
  sensorId: number,
) => {
  const [startDay, startMonth, startYear] = date1.split('.');
  const [endDay, endMonth, endYear] = date2.split('.');
  const startDate = new Date(
    Date.UTC(Number(startYear), Number(startMonth) - 1, Number(startDay), 0, 0),
  );
  const endDate = new Date(
    Date.UTC(Number(endYear), Number(endMonth) - 1, Number(endDay), 23, 59),
  );
  const chartData = await Meteo.getChartData(startDate, endDate, sensorId);

  return chartData.map((data) => ({
    temp: data.temp,
    humi: data.humidity || 0, // mobile app crashes if return null :-(
    time: data.created.toLocaleString('ru'),
  }));
};
