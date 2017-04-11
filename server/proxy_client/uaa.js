
import ProxyClient from './client';

class UaaProxyClient extends ProxyClient {
  _url(req) {
    return req.path;
  }
}

export default UaaProxyClient;
