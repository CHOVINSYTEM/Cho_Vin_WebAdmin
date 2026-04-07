const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api/proxy",
    createProxyMiddleware({
      target: "http://161.118.238.100:8081/api", // Cổng 8081 cho môi trường Dev
      changeOrigin: true,
      pathRewrite: { "^/api/proxy": "/" }, // Xóa prefix /api/proxy khi gửi đến server
      logger: console,
    })
  );
};
