import * as forge from "node-forge";


function F创建rsa() {

    var rsa = forge.pki.rsa;
    rsa.generateKeyPair({ bits: 2048, workers: 2 }, function (err, keypair) {

        // 获取公钥
        var publicKey = keypair.publicKey;

        // 获取私钥
        var privateKey = keypair.privateKey;

        // 将公钥和私钥转换为PEM格式
        var publicKeyPem = forge.pki.publicKeyToPem(publicKey);
        var privateKeyPem = forge.pki.privateKeyToPem(privateKey);

        console.log('Public Key:', publicKeyPem);
        console.log('Private Key:', privateKeyPem);
    });

}


function F生成服务器证书(ca私钥: forge.pki.rsa.PrivateKey, caName: any, dnsNames: string[]) {

    var keys = forge.pki.rsa.generateKeyPair(2048);
    var privateKey = keys.privateKey;
    var publicKey = keys.publicKey;


    var cert = forge.pki.createCertificate();

    cert.serialNumber = forge.util.bytesToHex(forge.random.getBytesSync(16)); // 随机生成序列号

    cert.publicKey = publicKey;

    var notBefore = new Date();
    var notAfter = new Date();

    notAfter.setFullYear(notBefore.getFullYear() + 1); // 有效期为一年

    cert.validity.notBefore = notBefore;
    cert.validity.notAfter = notAfter;

    var subject = [{
        name: 'commonName',
        value: dnsNames[0]
    }];

    cert.setSubject(subject);
    cert.setIssuer(caName);



    const dnsEx = dnsNames.map(v => {

        return {
            type: 2,
            value: v
        };
    });

    // 设置扩展，包括服务器验证用途
    var extensions = [{
        name: 'basicConstraints',
        cA: false,
    }, {
        name: 'keyUsage',
        keyCertSign: true,
        digitalSignature: true,
        keyEncipherment: true,
        dataEncipherment: true
    },
    {
        name: 'subjectAltName',
        altNames: dnsEx
    }];




    cert.setExtensions(extensions);

    cert.sign(ca私钥, forge.md.sha256.create());

    var pem = forge.pki.certificateToPem(cert);
    var base64Pem = forge.util.encode64(pem);

    const keyPem = forge.pki.privateKeyToPem(privateKey);
    const keyPemBase64 = forge.util.encode64(keyPem);
    // base64-encode p12
    var p12Asn1 = forge.pkcs12.toPkcs12Asn1(privateKey, cert, null);
    var p12Der = forge.asn1.toDer(p12Asn1).getBytes();
    var p12b64 = forge.util.encode64(p12Der);

    return {
        privateKey:privateKey,
        serverBase64Pem: base64Pem,

        serverKeyPem: keyPemBase64,

        serverP12Pem:p12b64
    };
}



function F生成CA证书() {

    var keys = forge.pki.rsa.generateKeyPair(2048);
    var privateKey = keys.privateKey;
    var publicKey = keys.publicKey;


    var cert = forge.pki.createCertificate();

    cert.serialNumber = forge.util.bytesToHex(forge.random.getBytesSync(16)); // 随机生成序列号

    cert.publicKey = publicKey;

    var notBefore = new Date();
    var notAfter = new Date();

    notAfter.setFullYear(notBefore.getFullYear() + 1); // 有效期为一年

    cert.validity.notBefore = notBefore;
    cert.validity.notAfter = notAfter;

    var subject = [{
        name: 'commonName',
        value: 'My Test CA'
    }, {
        name: 'countryName',
        value: 'CN'
    }];

    cert.setSubject(subject);
    cert.setIssuer(subject);

    // 设置扩展，包括服务器验证用途
    var extensions = [{
        name: 'basicConstraints',
        cA: true,
    }, {
        name: 'keyUsage',
        keyCertSign: true,
        digitalSignature: true,
    }, {
        name: 'extKeyUsage',
        serverAuth: true,
    }];


    cert.setExtensions(extensions);

    cert.sign(privateKey, forge.md.sha256.create());

    var pem = forge.pki.certificateToPem(cert);
    var base64Pem = forge.util.encode64(pem);

    return {
        privateKey: privateKey,

        caBase64Pem: base64Pem,

        caName: subject
    };
}


function F创建一个Base64下载链接的LI标签(name: string, base64Str: string) {
    const a = document.createElement('a');
    a.download = name;

    a.textContent = name;
    a.setAttribute('href', 'data:application/x-pkcs12;base64,' + base64Str);

    const li = document.createElement('li');

    li.appendChild(a);

    return li;
}





const button = <HTMLButtonElement>document.getElementById('button');
const textArea = <HTMLTextAreaElement>document.getElementById('textArea');
const linkList = <HTMLUListElement>document.getElementById('linkList');


function F创建下载链接(obj:{name:string, base64Str:string}[]){
    obj.forEach(v=>{

        linkList.appendChild(F创建一个Base64下载链接的LI标签(v.name, v.base64Str));

    });
}


button.addEventListener("click", (e) => {

    button.disabled = true;

    const lines = textArea.value.split('\n').filter(v=> v.trim() !== "");

    linkList.innerHTML = '';

    const ca = F生成CA证书();

    const server = F生成服务器证书(ca.privateKey, ca.caName, lines.length !== 0? lines:["baidu.com", "github.com"]);


    F创建下载链接([
        {
            name: "ca.cer",
            base64Str: ca.caBase64Pem
        },

        {
            name: "server.cer",
            base64Str: server.serverBase64Pem,
        },

        {
            name: "server_key.pem",
            base64Str: server.serverKeyPem,
        },

        {
            name: "server.p12",
            base64Str: server.serverP12Pem,
        },


    ])



});

