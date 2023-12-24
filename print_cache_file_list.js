const fs = require('fs');
const path = require('path');

function listFiles(dir, root) {
    let results = [];
    const list = fs.readdirSync(dir);
 
    list.forEach(function(file) {
        
        file = dir + '/' + file;
 
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            /* 递归读取子目录 */
            results = results.concat(listFiles(file, root));
        } else {
            /* 替换根目录为"." */
            const outPath = '.' + file.substring(root.length);
            results.push(outPath);
        }
    });
    return results;
}

const rootDir = process.argv[2].replace('\\', '').replace('/', '');
console.log(listFiles(rootDir, rootDir));
