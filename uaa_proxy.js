
import { ApiProxy } from './api_proxy';

class UaaProxyClient extends ApiProxy {
  _url(req) {
    return req.path;
  }
}

function uaaProxy() {
  const client = new UaaProxyClient({ baseURL: process.env.CONSOLE_UAA_URL });

  function uaaProxyHandler(req, res) {
    client.proxy(req, res);
  }

  return uaaProxyHandler;
}

export default uaaProxy;
