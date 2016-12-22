const http = require('http');


/**
 * 处理 GET 请求
 * @param  {object} req request
 * @param  {object} res response
 * @return {object}     response
 */
const httpGet = (req, res) => {
  const options = {
    host: 'www.domain.com',
    path: req.path,
  };
  http.get(options, (proxyRes) => {
    let body = '';
    proxyRes.on('data', (chunk) => {
      body += chunk;
    });
    proxyRes.on('end', () => {
      try {
        const parsed = JSON.parse(body);
        res.json(parsed);
      } catch (exception) {
        console.log('httpGet parsed: ', exception);
        res.json({
          code: 5000,
          message: '服务器错误',
          error: exception,
        });
      }
    });
  });
};


/**
 * 处理除 GET 请求之外的请求
 * @param  {object} req request
 * @param  {object} res response
 * @return {object}     response
 */
const httpRequest = (req, res) => {
  const method = req.method;
  const path = req.path;
  const body = JSON.stringify(req.body);
  const options = {
    hostname: 'www.domain.com',
    path,
    method,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': body.length,
    },
  };
  const proxyReq = http.request(options, (proxyRes) => {
    console.log('status: ', proxyRes.statusCode);
    console.log('headers: ', JSON.stringify(proxyRes.headers));
    proxyRes.setEncoding('utf8');
    proxyRes.on('data', (chunk) => {
      console.log('chunk: ', chunk);
    });
  });

  proxyReq.on('error', (error) => {
    console.log('httpRequest error: ', error);
    return res.json({
      code: 5000,
      message: '服务器错误',
      error,
    });
  });

  proxyReq.write(body);
  proxyReq.end();
};

const proxy = (req, res, next) => {
  console.log('proxy');
  console.log('req.path: ', req.path);
  console.log('req.method: ', req.method);
  const path = req.path;
  // 如果 path 开头包含 /api/，则说明是 API 请求，则通过代理对请求进行转发
  if (path.indexOf('/api/') === 0) {
    const method = req.method;
    if (method.toLowerCase() === 'get') {
      return httpGet(req, res);
    }
    return httpRequest(req, res);
  }

  next();
};


module.exports = proxy;
