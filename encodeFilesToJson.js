const fs = require('fs');
const path = require('path');

// 1. 从命令行参数中获取文件夹路径
const folderPath = process.argv[2];

if (!folderPath) {
  console.error('请提供一个文件夹路径');
  process.exit(1);
}

if (!fs.existsSync(folderPath)) {
  console.error('提供的文件夹路径不存在');
  process.exit(1);
}

if (!fs.statSync(folderPath).isDirectory()) {
  console.error('提供的路径不是文件夹');
  process.exit(1);
}

// 2. 从文件夹中获取所有文件
const files = fs.readdirSync(folderPath).filter(file => {
  return fs.statSync(path.join(folderPath, file)).isFile();
});

// 3. 将每个文件按照步骤4中描述的格式序列化为一个JSON字符串
const fileData = {};
for (const file of files) {
  const filePath = path.join(folderPath, file);
  const fileExtension = path.extname(file);
  const fileNameWithoutExtension = path.basename(file, fileExtension);

  // 4. 文件名为Key(不包括扩展名), 文件中的值以二进制的形式读取, 然后使用Base64编码为字符串作为值
  const fileBuffer = fs.readFileSync(filePath);
  const base64String = fileBuffer.toString('base64');
  fileData[fileNameWithoutExtension] = base64String;
}

// 5. 序列化为的JSON字符串, 跟Base64字符串, 都可以使用WEB 浏览器中的javascript代码解码跟反序列化
const jsonData = JSON.stringify(fileData, null, 2);

// 6. 最终的JSON字符串以UTF-8编码的形式写入到一个文件当中, 这个文件保存在输入的文件夹下
const outputFile = path.join(folderPath, 'fileData.json');
fs.writeFileSync(outputFile, jsonData, 'utf-8');

console.log(`文件已写入: ${outputFile}`);
