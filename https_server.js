const https = require('https');
const fs = require('fs');
const path = require('path');

// 服务器设置
const rootPath = process.argv[2] || './public'; // 根路径，默认为当前目录下的public文件夹
const certPath = process.argv[3] || './cert.pem'; // 证书路径，默认为当前目录下的cert.pem
const keyPath = process.argv[4] || './key.pem'; // 私钥路径，默认为当前目录下的key.pem

// 创建HTTPS服务器
const server = https.createServer({
  cert: fs.readFileSync(certPath),
  key: fs.readFileSync(keyPath)
});

server.on('request', (req, res) => {
  const filePath = path.join(rootPath, req.url);

  // 检查文件是否存在
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.writeHead(404);
      res.end('File not found');
      return;
    }

    // 读取文件并返回
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Error reading file');
        return;
      }

      res.end(content);
    });
  });
});

// 监听端口
const port = 443;
server.listen(port, () => {
  console.log(`Server running at https://localhost:${port}/`);
});
