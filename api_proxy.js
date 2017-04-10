/* eslint no-param-reassign: ["error", { "props": false }] */

import stream from 'stream';
import refresh from 'passport-oauth2-refresh';

function forwardResponse(response, res) {
  // Set upstream headers
  ['content-type', 'content-length'].forEach(header => {
    if (header in response.headers) {
      res.append(header, response.headers[header]);
    }
  });

  // Include upstream status and data
  res.status(response.status).send(response.data);
}

function apiProxyHandler(client) {
  function apiProxy(req, res) {
    const {
      baseUrl,
      body,
      method,
      query,
      path,
      user
    } = req;

    let data = undefined;
    if (['put', 'post', 'patch'].includes(method)) {
      data = new stream.PassThrough();
      data.on('error', (err) => {
        console.error('Error writing to api client request', err);
      });

      // Pipe request body to the client
      req.pipe(data);
    }

    // TODO client could send both v2 and v3, both are supported by the upstream API
    client.request({
      body,
      method,
      params: query,
      url: `${baseUrl}${path}`,
      data,
      headers: {
        Authorization: `Bearer ${user.accessToken}`
      }
    })
    .catch(err => {
      // Check if the token needs refreshing
      // TODO would be nice if the expiry time was exposed so that we could
      // guess when the token is expiring without hitting the server.
      const response = err.response || {};
      if (response.status !== 401) {
        return Promise.reject(err);
      }

      // The token is probably expired, refresh it
      console.log('401 from upstream API, refreshing token.');

      return new Promise((resolve, reject) => {
        reject(new Error('foooooo'));
        if (!req) {
          console.error('derp');
          reject(new Error('No request?'));
        }

        refresh.requestNewAccessToken(
          'oauth2',
          req.user.refreshToken,
          (error, accessToken, refreshToken) => {
            if (error) {
              console.log('Error while refreshing token', { error });

              // Send a 401 to trigger a new login
              res.status(401).send({ status: 'unauthorized' });
              reject(error);
              return;
            }

            console.log({ accessToken, refreshToken });

            // Update the user
            req.user.accessToken = accessToken;
            req.user.refreshToken = refreshToken;

            // Update the session
            req.session.passport = { user: req.user };

            // Re-try the request once
            client
              .request(response.config)
              .then(resolve, reject);
          }
        );
      });
    })
    .then(response => {
      console.log('API proxy request', {
        method: response.config.method,
        url: response.config.url,
        status: response.status,
        req_size: (response.body || '').length,
        length: response.headers['content-length'],
        req_headers: response.config.headers
      });

      forwardResponse(response, res);
    })
    .catch(err => {
      const response = err.response || {};

      console.error('API proxy error', {
        message: err.message,
        status: response.status,
        data: response.data
      });

      if (response.status) {
        forwardResponse(response, res);
        return;
      }

      res.status(502).send({
        description: `Error connecting to API: ${err.message}`
      });
    });
  }

  return apiProxy;
}

export default apiProxyHandler;
