import { Settings } from '../services/Settings';

export const requestSettings = async () => {
  const data = await Settings.read();
  const settings = data.reduce((acc, setting) => {
    return {
      ...acc,
      [setting.key]: setting.value,
    };
  }, {});

  return settings;
};

export interface ISettingsParams {
  [key: string]: number;
}

export const updateSettings = async (params: ISettingsParams) => {
  const settings = Object.keys(params).map((key: string) => ({
    key,
    value: Number(params[key]),
  }));

  await Settings.write(settings);

  return null;
};
