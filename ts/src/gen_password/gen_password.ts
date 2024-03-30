
//加二行注释测试
const pass = <HTMLInputElement>document.getElementById('password');
const butt = document.getElementById('button');
const seleFile = document.getElementById('seleFile');
const user = <HTMLInputElement>document.getElementById('username');
const sha256Code = <HTMLInputElement>document.getElementById('sha256Code');
function createPass(len: number, isuserName: boolean) {

    function generatePassword(length: number, characters: string) {
        return Array.from(crypto.getRandomValues(new Uint32Array(length)))
            .map((x) => characters[x % characters.length])
            .join('');

    }

    function F检测生成的字符串中是否包含字符(v待检测字符串数组:string[], v被检测字符串:string){
     
        const v被检测字符数组 = [...v被检测字符串];
        const res = v待检测字符串数组.map(v待检测字符串=>{
            let n = 0;

            [...v待检测字符串].forEach(v待检测字符 =>{

                for (const iterator of v被检测字符数组) {
                    if(v待检测字符 === iterator){
                        n+=1;
                        return;
                    }
                }

            });

            return n;
        }).filter(v=> v>= 2).length === v待检测字符串数组.length;

        return res;

    }

    const specials = '!@#$%^&*()_+{}:"<>?\|[];\',./`~';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';

    let vs:string[]
    if (isuserName) {
        vs = [lowercase,uppercase,numbers];


        
    }
    else {
        vs = [specials,lowercase,uppercase,numbers];



    }

    const sum = vs.join("");
    let n = 0;
    while(true){

        const v = generatePassword(len, sum);

        if(F检测生成的字符串中是否包含字符(vs, v)){
            console.log(n);
            return v;
        }
        else{
            n+=1;

            if(n > 1000){
                throw new Error("生成失败");
            }
        }
    
    }

}



seleFile?.addEventListener("click", async (e) => {

    const pickerOpts = {

        multiple: false,
    };


    const files: FileSystemFileHandle[] = await (<any>window).showOpenFilePicker(pickerOpts);

    const file = await files[0].getFile();
    const fileBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", fileBuffer); // 计算消息的哈希值
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // 将缓冲区转换为字节数组
    const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join(""); // 将字节数组转换为十六进制字符串
   
    sha256Code.value = hashHex


});


butt?.addEventListener("click", (e) => {

    pass.value = createPass(16, false);

    user.value = createPass(8, true);

});