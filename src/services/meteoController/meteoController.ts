import { Socket } from 'net';

import { Sensors } from '../../constants';

interface IMeteoControllerData {
  id: Sensors;
  temp: string;
  humi?: string;
}

export class MeteoController {
  ip: string;
  port: number;
  data: string;

  constructor(ip: string, port: number) {
    this.port = port;
    this.ip = ip;
  }

  parseData(): IMeteoControllerData[] {
    const matches = this.data.match(/^T1=(.*)H1=(.*)T2=(.*)T3=(.*)DEBUG=(\d)/);

    if (matches) {
      const [, hallTemp, hallHumi, inletTemp, boilerTemp] = matches;

      return [
        {
          id: Sensors.hall,
          temp: hallTemp,
          humi: hallHumi,
        },
        {
          id: Sensors.inlet,
          temp: inletTemp,
        },
        {
          id: Sensors.boiler,
          temp: boilerTemp,
        },
      ];
    }

    throw new Error(`Error while parsing data: ${this.data}`);
  }

  requestData(): Promise<string> {
    return new Promise((resolve, reject) => {
      const client = new Socket();
      this.data = '';

      client.connect(this.port, this.ip);

      client.on('data', (clientData) => {
        this.data += clientData;
      });

      client.on('close', () => {
        resolve(this.data);
      });

      client.on('error', (e) => {
        reject(e);
      });
    });
  }
}
