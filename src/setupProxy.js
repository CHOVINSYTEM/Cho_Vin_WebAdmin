const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api/proxy",
    createProxyMiddleware({
      target: "http://161.118.238.100:8080/api",
      changeOrigin: true,
      pathRewrite: {},
      logger: console,
      on: {
        proxyReq: (proxyReq, req, res) => {
          console.log(`[Proxy] ${req.method} ${req.originalUrl} -> ${proxyReq.protocol}//${proxyReq.host}${proxyReq.path}`);
        },
        error: (err, req, res) => {
          console.error("[Proxy Error]", err.message);
        },
      },
    })
  );
};
