
import UaaProxyClient from '../proxy_client/uaa';

function uaaProxy() {
  const client = new UaaProxyClient({ baseURL: process.env.CONSOLE_UAA_URL });

  function uaaProxyHandler(req, res) {
    client.proxy(req, res);
  }

  return uaaProxyHandler;
}

export default uaaProxy;
