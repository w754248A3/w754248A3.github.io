const fs = require('fs');
const path = require('path');




function getEntryObject(obj, directory, subpath) {


    function getAllJsFilesSync(directory, subpath) {
        let jsFiles = [];
        
        const files = fs.readdirSync(directory);
        for (const file of files) {
            const fullPath = path.join(directory, file);
            const stat = fs.statSync(fullPath);
            let v = path.posix.join(subpath, file);
            
            if (stat.isDirectory()) {
                // 如果是目录，递归调用

                jsFiles = jsFiles.concat(getAllJsFilesSync(fullPath, v));
            } else if (path.extname(file) === '.js') {
                // 如果是.js文件，添加到数组中

                jsFiles.push(v);
            }
        }

        return jsFiles;
    }


    function splitPathToArray(filePath) {
        // 使用 path.sep 获取系统特定的路径分隔符
        const separator = path.posix.sep;

        // 分割路径
        const parts = filePath.split(separator);

        return parts;
    }


    function getObject(obj, array) {

        array.forEach(e => {

            const vs = splitPathToArray(e);

            obj[path.posix.join(vs[vs.length - 2], vs[vs.length - 1])] = './' + e;
        });

        return obj;
    }






    const array = getAllJsFilesSync(directory, subpath);

    getObject(obj, array);

    return obj;

}

console.log(getEntryObject({}, "ts/dist", "./dist"));