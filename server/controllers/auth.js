/* eslint-disable no-unused-vars */
/* eslint no-param-reassign: ["error", { "props": false }] */

import path from 'path';

import axios from 'axios';
import express from 'express';
import passport from 'passport';
import oauth2 from 'passport-oauth2';
import refresh from 'passport-oauth2-refresh';


const auth = {
  init(app) {
    // Configure oauth2 strategy
    const strategy = new oauth2.Strategy({
      authorizationURL: `${process.env.CONSOLE_LOGIN_URL}/oauth/authorize`,
      tokenURL: `${process.env.CONSOLE_LOGIN_URL}/oauth/token`,
      clientID: process.env.CONSOLE_CLIENT_ID,
      clientSecret: process.env.CONSOLE_CLIENT_SECRET,
      callbackURL: `${process.env.APP_URL}/oauth2callback`,
      state: true,
      scope: [
        'cloud_controller.read',
        'cloud_controller.write',
        'cloud_controller.admin',
        'openid',
        'scim.read'
      ]
    },
    (accessToken, refreshToken, profile, cb) => {
      // There's no user to lookup, so we just return the data as a simple
      // user modlel.
      const user = {
        accessToken,
        refreshToken
      };
      cb(null, user);
    });

    passport.use(strategy);
    refresh.use(strategy);

    passport.serializeUser((user, cb) => {
      // No serialization
      cb(null, user);
    });

    passport.deserializeUser((user, cb) => {
      // No deserialization
      cb(null, user);
    });

    const authRouter = new express.Router();

    // Mount the route handlers before passport initialization
    authRouter.get('/login', auth.login);
    authRouter.get('/logout', auth.logout);
    authRouter.get('/callback', auth.callback);

    // Initialize passport for OAuth
    app.use(passport.initialize());
    app.use(passport.session());

    return authRouter;
  },

  callback(req, res) {
    res.redirect(`${process.env.APP_URL}/#/dashboard`);
  },

  login(req, res) {
    passport.authenticate('oauth2')(req, res);
  },

  logout(req, res) {
    req.session = null;
    res.redirect(`${process.env.CONSOLE_LOGIN_URL}/logout.do`);
  },

  requireLogin(req, res, next) {
    if (!req.user) {
      res.status(401).send({ status: 'unauthorized' });
    }

    next();
  }
};

export default auth;
