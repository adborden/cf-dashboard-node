
import ProxyClient from '../proxy_client/client';

function apiProxy() {
  const client = new ProxyClient({ baseURL: process.env.CONSOLE_API_URL });

  function apiProxyHandler(req, res) {
    client.proxy(req, res);
  }

  return apiProxyHandler;
}

export default apiProxy;
