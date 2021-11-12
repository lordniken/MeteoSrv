import { Socket } from 'net';

export interface IMeteoControllerData {
  hallTemp: string;
  hallHumi: string;
  boilerTemp: string;
  inletTemp: string;
}

export class MeteoController {
  ip: string;
  port: number;

  constructor(ip: string, port: number) {
    this.port = port;
    this.ip = ip;
  }

  parseData(data: string): IMeteoControllerData {
    const matches = data.match(/^T1=(.*)H1=(.*)T2=(.*)T3=(.*)DEBUG=(\d)/);

    if (matches) {
      const [, hallTemp, hallHumi, inletTemp, boilerTemp] = matches;

      return {
        hallTemp,
        hallHumi,
        boilerTemp,
        inletTemp,
      };
    }

    throw new Error(`Error while parsing data: ${data}`);
  }

  requestData(): Promise<string> {
    return new Promise((resolve, reject) => {
      const client = new Socket();
      let data = '';

      client.connect(this.port, this.ip);

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
