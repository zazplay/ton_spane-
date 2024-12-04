const { defineConfig } = require('@vue/cli-service');
const webpack = require('webpack');

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        '__VUE_OPTIONS_API__': JSON.stringify(true), // Включає Options API
        '__VUE_PROD_DEVTOOLS__': JSON.stringify(false), // Вимикає DevTools у продакшні
        '__VUE_PROD_HYDRATION_MISMATCH_DETAILS__': JSON.stringify(false), // Уникає помилок, пов'язаних з гідратацією
      }),
    ],
  },
  devServer: {
    host: '0.0.0.0',
    port: 8080, // Ваш бажаний порт
    allowedHosts: 'all',
    client: {
      webSocketURL: {
        hostname: '0.0.0.0',
        pathname: '/ws',
        port: 8080,
      },
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
});
