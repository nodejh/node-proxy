const http = require('http');
const url = require('url');
const net = require('net');


const port = process.env.PORT || 9000;


/**
 * 普通代理
 * @param req
 * @param res
 */
const request = (req, res) => {
  console.log('request...');
  const urlParse = url.parse(req.url);
  const options = {
    host: urlParse.host,
    hostname: urlParse.hostname,
    port: urlParse.port || 80,
    path: urlParse.path,
    method: req.method,
    headers: req.headers,
  };
  console.log('options: ', options);
  const proxyReq = http.request(options, (proxyRes) => {
    console.log('proxyRes.statusCode: ', proxyRes.statusCode);
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  }).on('error', function(e) {
    console.log('e: ', e);
    res.end();
  });

  req.pipe(proxyReq);
};


/**
 * 隧道代理
 * @param req
 * @param sock
 */
const connect = (req, sock) => {
  console.log('connect...');
  const urlParse = url.parse(`http://${req.url}`);
  const proxySock = net.connect(urlParse.port, urlParse.hostname, () => {
    sock.write('HTTP/1.1 200 Connection Established\r\n\r\n');
    proxySock.pipe(sock);
  }).on('error', (e) => {
    console.log('e: ', e);
    sock.end();
  });

  sock.pipe(proxySock);
};


http.createServer()
  .on('request', request)
  .on('connect', connect)
  .listen(port, () => {
  console.log(`Server is running at port ${port}`);
});

