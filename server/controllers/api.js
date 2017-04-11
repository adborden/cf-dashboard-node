/* eslint-disable no-unused-vars */
/* eslint no-param-reassign: ["error", { "props": false }] */

import express from 'express';
import apiProxy from './api_proxy';


const api = {
  init(app, options = {}) {
    const baseURL = options.baseURL || process.env.CONSOLE_API_URL;
    const apiRouter = new express.Router();

    // Disable caching
    // TODO come up with an API caching strategy
    app.set('etag', false);

    apiRouter.get('/authstatus', api.authStatus);
    apiRouter.all('*', apiProxy());

    return apiRouter;
  },

  authStatus(req, res) {
    if (!req.user) {
      return res.status(401).send({ status: 'unauthorized' });
    }

    return res.send({ status: 'authorized' });
  }
};

export default api;
