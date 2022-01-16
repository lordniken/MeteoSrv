import { Settings } from '../services/Settings';

export const requestSettings = async () => {
  const settings = await Settings.read();

  return settings;
};

export interface ISettingsParams {
  [key: string]: number;
}

export const updateSettings = async (params: ISettingsParams) => {
  /*
  const settings = Object.keys(params).map((key: string) => ({
    key,
    value: Number(params[key]),
  }));

  await Settings.write(settings);
  */

  return null;
};
