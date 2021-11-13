import express from 'express';
import dotenv from 'dotenv';
import cron from 'node-cron';
import { createConnection } from 'typeorm';

import { CronJob } from './services/CronJob';
import { router } from './controllers';

dotenv.config();

const port = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use('/', router);

const init = async () => {
  try {
    await createConnection();

    app.listen(port, async () => {
      console.log('Server has been started!');

      cron.schedule(CronJob.schedule, CronJob.run);
    });
  } catch (error) {
    console.log('Error while connection to the db: ', error);
  }
};

init();
