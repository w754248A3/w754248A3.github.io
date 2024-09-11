const fs = require('fs');
const path = require('path');

// 获取命令行参数中的文件夹路径
const folderPath = process.argv[2];

if (!folderPath) {
    console.error('请提供文件夹路径作为参数');
    process.exit(1);
}

// 读取文件夹中的所有文件
fs.readdir(folderPath, (err, files) => {
    if (err) {
        console.error('无法读取文件夹:', err);
        process.exit(1);
    }

    // 过滤出".txt"文件
    const txtFiles = files.filter(file => path.extname(file) === '.txt');

    const result = [];

    txtFiles.forEach(file => {
        const filePath = path.join(folderPath, file);

        // 读取文件的统计信息（包括创建时间和修改时间）
        const stats = fs.statSync(filePath);
        const creationTime = stats.birthtime;
        const modificationTime = stats.mtime;

        // 读取文件内容
        const content = fs.readFileSync(filePath, 'utf-8');

        // 文件名和文件内容转换为Base64编码

        const fileName = path.parse(file).name;

        const fileNameBase64 = Buffer.from(fileName, 'utf-8').toString('base64');
        const contentBase64 = Buffer.from(content, 'utf-8').toString('base64');

        // 生成JSON对象
        const jsonObject = {
            fileNameBase64: fileNameBase64,
            contentBase64: contentBase64,
            creationTime: creationTime,
            modificationTime: modificationTime
        };

        result.push(jsonObject);
    });

    // 将JSON数组写入到一个文件中
    const outputFilePath = path.join(folderPath, 'result.json');
    fs.writeFileSync(outputFilePath, JSON.stringify(result, null, 2), 'utf-8');

    console.log('JSON文件已成功生成:', outputFilePath);
});
