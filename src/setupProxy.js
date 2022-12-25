const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://185.3.95.67:3000',
      changeOrigin: true,
    })
  );
};