import { getRepository } from 'typeorm';

import { Settings as SettingsEntity } from '../../entities';

export interface ISetting {
  key: string;
  value: number;
}

export class Settings {
  private static get repository() {
    return getRepository(SettingsEntity);
  }

  static async read() {
    const data = await Settings.repository.find({ select: ['key', 'value'] });

    return data;
  }

  static async write(settings: ISetting[]) {
    await Settings.repository.clear();

    settings.forEach(async (setting) => {
      const data = await Settings.repository.create(setting);

      await Settings.repository.save(data);
    });

    return null;
  }
}
