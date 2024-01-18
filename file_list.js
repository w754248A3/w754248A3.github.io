// app.js

const fs = require('fs');
const path = require('path');

/**
 * 递归遍历目录，收集所有文件的相对路径
 * @param {string} dir - 要遍历的目录
 * @param {string} relativePath - 相对路径
 * @param {Array<string>} result - 收集结果的数组
 */
function collectFilePaths(dir, relativePath, result) {
  const files = fs.readdirSync(path.join(dir, relativePath));

  files.forEach(file => {
    const absolutePath = path.join(dir, relativePath, file);
    const stat = fs.statSync(absolutePath);

    if (stat.isDirectory()) {
      // 使用 posix 格式确保路径分隔符为 "/"
      const newRelativePath = path.posix.join(relativePath, file);
      collectFilePaths(dir, newRelativePath, result);
    } else {
      // 构建符合 Web 标准的相对路径
      const webPath = buildWebPath(relativePath, file);
      result.push(webPath);
    }
  });
}

/**
 * 构建符合 Web 标准的相对路径
 * @param {string} relativePath - 相对路径
 * @param {string} file - 文件名
 * @returns {string} - Web 标准的相对路径
 */
function buildWebPath(relativePath, file) {
  // 确保相对路径以 "./" 开头，如果不是，则添加 "./"
  let webPath = relativePath.startsWith('./') ? relativePath : `./${relativePath}`;
  // 确保路径不以 "/" 结尾
  if (webPath.endsWith('/')) {
    webPath = webPath.slice(0, -1);
  }
  // 拼接文件名
  webPath = `${webPath}/${file}`;
  return webPath;
}

/**
 * 主函数
 * @param {string} rootDir - 根目录
 */
function generateFilePathArray(rootDir) {
  const result = [];
  collectFilePaths(rootDir, '', result);
  return result;
}

// 从命令行参数获取根目录
const rootDir = process.argv[2];

// 检查根目录是否以 "/" 结尾，如果是，则去除
if (rootDir.endsWith('/')) {
  rootDir = rootDir.slice(0, -1);
}

if (!rootDir) {
  console.error('请提供一个根目录作为参数');
  process.exit(1);
}

const filePathArray = generateFilePathArray(rootDir);

console.log(filePathArray);
