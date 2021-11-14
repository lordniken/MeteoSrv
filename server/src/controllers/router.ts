import express from 'express';

import { requestStatus } from './status';
import { requestChart } from './chart';

const router = express.Router();

router.get('/', async (req, res) => {
  // phone app without REST support :-(
  switch (req.query.action) {
    case 'get_graph_data': {
      const chart = await requestChart(
        String(req.query.date1),
        String(req.query.date2),
        Number(req.query.id),
      );

      return res.status(200).json(chart);
    }
    default: {
      const status = await requestStatus();

      return res.status(200).json(status);
    }
  }
});

export { router };
