import express from 'express';

import { requestStatus } from './status';

const router = express.Router();

router.get('/', async (req, res) => {
  const status = await requestStatus();

  // phone app without REST support :-(
  switch (req.query.action) {
    default:
      return res.status(200).json(status);
  }
});

export { router };
