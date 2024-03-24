// webpack.config.js
const path = require('path');

module.exports = {
  
  entry: {
    ["sw.js"]: '/src/service-worker/sw.ts',
    ["main.js"]: './src/main/main.ts',
    // 可以根据需要添加更多入口
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: '[name]',
    path: path.resolve(__dirname, '../wwwroot/')
  },
};
