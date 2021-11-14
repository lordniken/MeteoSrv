import express from 'express';

import { Routes } from '../constants';

import { requestChart } from './chart';
import { requestSettings } from './settings';
import { requestStatus } from './status';

const router = express.Router();

router.get('/', async (req, res) => {
  // phone app without REST support :-(
  switch (req.query.action) {
    case Routes.chart: {
      const chart = await requestChart(
        String(req.query.date1),
        String(req.query.date2),
        Number(req.query.id),
      );

      return res.status(200).json(chart);
    }

    case Routes.settings: {
      const settings = await requestSettings();

      return res.status(200).json(settings);
    }

    default: {
      const status = await requestStatus();

      return res.status(200).json(status);
    }
  }
});

export { router };
