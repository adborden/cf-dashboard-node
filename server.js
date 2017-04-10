import path from 'path';
import express from 'express';
import morgan from 'morgan';
import passport from 'passport';

import cookieSession from 'cookie-session';
import { auth, home, api } from './controllers';
import uaaProxy from './uaa_proxy';

const app = express();
const port = process.env.PORT || 8080;


app.use(morgan('combined')); // logging middleware

// Static routes
app.use('/assets', express.static(path.join(__dirname, 'static', 'assets')));
app.get('/favicon.ico', (req, res) => {
  res.status(404).send('Not found');
});

app.use(cookieSession({
  name: 's',
  keys: [process.env.SESSION_KEY],
  maxAge: 7 * 24 * 3600 * 1000,
  path: '/',
  httpOnly: true,
  secure: process.env.SECURE_COOKIES !== '0',
  signed: true
}));

app.get('/', home);

//TODO register uaa callback as /auth/callback so that all the endpoints can be mounted under /auth
//app.use('/auth', auth.init(app));
auth.init(app); // Initialize the middleware, we throw out the router for now
app.get('/oauth2callback', passport.authenticate('oauth2'), auth.callback);
app.get('/handshake', auth.login);
app.get('/logout', auth.logout);

// Authorized-only endpoints
app.use(auth.requireLogin);
//app.use('/auth', auth.init(app));
//app.use('/api', api.init(app));
// Upstream API returns paged responses with next_url as if it was the full url so we need to mount to /v*
app.use('/v2', api.init(app));
app.use('/v3', api.init(app));
app.use('/uaa', uaaProxy());

const server = app.listen(port, 'localhost', () => {
  const address = server.address();
  console.log(`Listening on http://${address.address}:${address.port}`); // eslint-disable-line
});
