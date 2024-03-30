const videoPlayer = <HTMLVideoElement>document.getElementById('videoPlayer');
const startRecording = <HTMLButtonElement>document.getElementById('startRecording');
const stopRecording = <HTMLButtonElement>document.getElementById('stopRecording');
const canvas = <HTMLCanvasElement>document.getElementById("canvas");
const context = canvas.getContext('2d');
let mediaRecorder: MediaRecorder;
let recordedBlobs: Array<Blob>;

startRecording.addEventListener('click', () => {
    startRecording.disabled = true;
    stopRecording.disabled = false;
    recordedBlobs = [];
    navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
        .then(stream => {

            videoPlayer.srcObject = stream;

            videoPlayer.controls = false;

            videoPlayer.muted = true;

            videoPlayer.autoplay = true;
            setTimeout(()=> F开始执行反色(videoPlayer), 1000);
            mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.ondataavailable = event => {
                if (event.data && event.data.size > 0) {
                    //recordedBlobs.push(event.data);
                }
            };


            mediaRecorder.onstop = function () {

                stream.getTracks().forEach(v => v.stop());
                const superBuffer = new Blob(recordedBlobs, { type: 'video/webm' });



                const url = URL.createObjectURL(superBuffer);

                const a = document.createElement('a');
                a.href = url;
                a.download = 'recording.webm';  // 设置下载文件的名称
                document.body.appendChild(a);
                //a.click();
                // 清理并移除a元素
                document.body.removeChild(a);
                //URL.revokeObjectURL(url);


                videoPlayer.controls = true;

                videoPlayer.muted = false;
                videoPlayer.srcObject = null;
                videoPlayer.src = url;

                videoPlayer.play();
                
              
            };
            mediaRecorder.start();
        })
        .catch(error => {
            console.error('获取屏幕流失败', error);
        });
});

stopRecording.addEventListener('click', () => {
    stopRecording.disabled = true;
    startRecording.disabled = false;
    mediaRecorder.stop();


});


function F开始执行反色(video: HTMLVideoElement){
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    console.log(canvas.width, canvas.height);
    setTimeout(()=> drawFrame(video), 1000);

}


function drawFrame(video:HTMLVideoElement) {

    if(context === null){
        throw new Error("2d 绘制上下文是NULL");
    }

    context.drawImage(video, 0, 0);
    
    
    var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    invertColors(imageData.data);
    context.putImageData(imageData, 0, 0);
    
    setTimeout(function () {
      drawFrame(video);
    }, 10);
  }
  
  
  function invertColors(data : Uint8ClampedArray) {
    for (var i = 0; i < data.length; i+= 4) {
      data[i] = data[i] ^ 255; // Invert Red
      data[i+1] = data[i+1] ^ 255; // Invert Green
      data[i+2] = data[i+2] ^ 255; // Invert Blue
    }
  }
  