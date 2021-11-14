import { Socket } from 'net';

import { Sensors } from '../../constants';

export interface IMeteoControllerData {
  sensorId: Sensors;
  temp: number;
  humidity: number | null;
}

export class MeteoController {
  static round(value: string): number {
    return Math.round(Number(value) * 10) / 10;
  }

  static parse(data: string): IMeteoControllerData[] {
    const matches = data.match(/^T1=(.*)H1=(.*)T2=(.*)T3=(.*)DEBUG=(\d)/);

    if (matches) {
      const [, hallTemp, hallHumi, inletTemp, boilerTemp] = matches;

      return [
        {
          sensorId: Sensors.hall,
          temp: MeteoController.round(hallTemp),
          humidity: MeteoController.round(hallHumi),
        },
        {
          sensorId: Sensors.inlet,
          temp: MeteoController.round(inletTemp),
          humidity: null,
        },
        {
          sensorId: Sensors.boiler,
          temp: MeteoController.round(boilerTemp),
          humidity: null,
        },
      ];
    }

    throw new Error(`Error while parsing data: ${data}`);
  }

  static request(ip: string, port: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const client = new Socket();
      let data = '';

      client.connect(port, ip);

      client.on('data', (clientData) => {
        data += clientData;
      });

      client.on('close', () => {
        resolve(data);
      });

      client.on('error', (e) => {
        reject(e);
      });
    });
  }
}
