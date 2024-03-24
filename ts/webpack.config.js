// webpack.config.js
const path = require('path');

module.exports = {
  
  entry: {
    ["sw.js"]: './dist/service-worker/sw.js',
    ["screen_recording/screen_recording.js"]: './dist/screen_recording/screen_recording.js',
    // 可以根据需要添加更多入口
  },
  output: {
    filename: '[name]',
    path: path.resolve(__dirname, '../wwwroot/')
  },
};
