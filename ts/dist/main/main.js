"use strict";
//加一行注释测试
const pass = document.getElementById('pass');
const butt = document.getElementById('butt');
const seleFile = document.getElementById('seleFile');
const user = document.getElementById('user');
const sha256Code = document.getElementById('sha256Code');
function createPass(len, isuserName) {
    function generatePassword(length, characters) {
        return Array.from(crypto.getRandomValues(new Uint32Array(length)))
            .map((x) => characters[x % characters.length])
            .join('');
    }
    const specials = '!@#$%^&*()_+{}:"<>?\|[];\',./`~';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    if (isuserName) {
        const sum = lowercase + uppercase + numbers;
        return generatePassword(len, sum);
    }
    else {
        const sum = specials + lowercase + uppercase + numbers;
        return generatePassword(len, sum);
    }
}
seleFile?.addEventListener("click", async (e) => {
    const pickerOpts = {
        multiple: false,
    };
    const files = await window.showOpenFilePicker(pickerOpts);
    const file = await files[0].getFile();
    const fileBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", fileBuffer); // 计算消息的哈希值
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // 将缓冲区转换为字节数组
    const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join(""); // 将字节数组转换为十六进制字符串
    sha256Code.value = hashHex;
});
butt?.addEventListener("click", (e) => {
    pass.value = createPass(16, false);
    user.value = createPass(8, true);
});
//# sourceMappingURL=main.js.map