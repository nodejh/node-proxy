const http = require('http');
const url = require('url');

const port = process.env.PORT || 9000;


const server = http.createServer((req, res) => {
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
});




server.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});

