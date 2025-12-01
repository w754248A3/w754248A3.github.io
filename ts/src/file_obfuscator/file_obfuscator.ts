const processBtn = <HTMLButtonElement>document.getElementById('processBtn');
const statusDiv = <HTMLDivElement>document.getElementById('status');

// 检查浏览器是否支持 File System Access API
if (!('showOpenFilePicker' in window)) {
    statusDiv.innerHTML = '<span class="error">错误：您的浏览器不支持 File System Access API。<br>请使用最新版的 Chrome、Edge 或 Opera 浏览器。</span>';
    processBtn.disabled = true;
}

processBtn.addEventListener('click', async () => {
    statusDiv.innerHTML = '';
    processBtn.disabled = true;

    try {
        // 1. 选择源文件 (Input)
        const [fileHandle] = await window.showOpenFilePicker({
            types: [{ description: 'All Files', accept: { '*/*': [] } }],
            multiple: false
        });

        const file = await fileHandle.getFile();
        statusDiv.textContent = `已选择文件: ${file.name} (${formatSize(file.size)})\n等待保存位置...`;

        // 2. 选择保存位置 (Output)
        // 建议的文件名：原文件名 + .obfuscated
        const saveHandle = await window.showSaveFilePicker({
            suggestedName: file.name + '.obfuscated',
            types: [{ description: 'Obfuscated File', accept: { '*/*': [] } }]
        });

        statusDiv.textContent += `\n正在处理中 (流式模式)...`;

        // 3. 创建流处理管道
        const writableStream = await saveHandle.createWritable();
        const readableStream = file.stream();

        // 4. 定义转换流 (TransformStream) 用于按位取反
        const inversionStream = new TransformStream({
            transform(chunk, controller) {
                // chunk 是一个 Uint8Array
                // 我们直接在原数组上操作以节省内存
                for (let i = 0; i < chunk.length; i++) {
                    // 按位取反操作。
                    // 在 JS 中，~x 会将其转换为 32 位有符号整数。
                    // 但由于 chunk 是 Uint8Array，赋值回去时会自动截断为 8 位无符号整数。
                    // 等同于 chunk[i] = chunk[i] ^ 0xFF;
                    chunk[i] = ~chunk[i];
                }
                controller.enqueue(chunk);
            }
        });

        // 5. 管道连接: Read -> Invert -> Write
        await readableStream
            .pipeThrough(inversionStream)
            .pipeTo(writableStream);

        statusDiv.innerHTML += `\n<span class="success">成功！文件已保存。</span>`;

    } catch (err:any) {
        // 用户取消选择不报错，只在控制台记录
        if (err.name === 'AbortError') {
            statusDiv.textContent = '用户取消了操作。';
        } else {
            console.error(err);
            statusDiv.innerHTML += `\n<span class="error">发生错误: ${err.message}</span>`;
        }
    } finally {
        processBtn.disabled = false;
    }
});

// 辅助函数：格式化文件大小
function formatSize(bytes: number) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}