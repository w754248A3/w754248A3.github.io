const videoPlayer = <HTMLVideoElement>document.getElementById('videoPlayer');
const startRecording = <HTMLButtonElement>document.getElementById('startRecording');
const stopRecording = <HTMLButtonElement>document.getElementById('stopRecording');
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
            mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.ondataavailable = event => {
                if (event.data && event.data.size > 0) {
                    recordedBlobs.push(event.data);
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
                a.click();
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