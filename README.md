# cf-dashboard-node

Lessons learned porting to nodejs. This was a spike to figure out any issues
around running the dashboard with Nodejs.

## Trying it out

Don't forget to source your env file.

    $ npm install
    $ npm run build
    $ npm start


## Notable areas


### Passportjs

Passportjs doesn't expose access to the underlying token data very well. We use
`passport-oauth2-refresh` to handle the refresh logic. It still is lacking
because we can't check the token's expiry without going to the server.


### Cookie sessions

The cookie comes in at about 3036 bytes, so the session can fit in the cookie.
The go Oauth2 Token stores a bit more data.


## What's left


### proxy_client

proxy_client needs to be cleaned up I couldn't find a library that did exactly
what I wanted, but maybe there's a library out there that could simplify the
logic. Axios is not really the right tool for the job but it would be nice if it
was the same libraries used on client and server.


### Isomorphism

I had attempted to render the react views on the server, but got hung up on
getting the routing working. In theory, director can be used on both client and
server, we just need to do some effort to pull out the route config because the
APIs are separate.

The routes also assume you are rendering into a DOM element, so we also need
some work to render into a string instead on the server.
