const video_1 = <HTMLVideoElement>document.getElementById('video_1');
const video_2 = <HTMLVideoElement>document.getElementById('video_2');
const startRecording = <HTMLButtonElement>document.getElementById('startRecording');
let mediaRecorder: MediaRecorder;
let recordedBlobs: Array<Blob>;

startRecording.addEventListener('click', () => {
    startRecording.disabled = true;

    navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
        .then(stream => {

            video_1.srcObject = stream;

            video_1.controls = true;

            video_1.muted = true;

            video_1.autoplay = true;

            video_1.addEventListener('loadedmetadata', function () {
                // 获取视频分辨率

                console.log(video_1.videoWidth, video_1.videoHeight);

                const canvas_v = F创建画布(video_1.videoWidth, video_1.videoHeight);


                video_2.srcObject = canvas_v.canvas.captureStream(30);

                video_2.controls = true;

                video_2.muted = true;

                video_2.autoplay = true;
                window.requestAnimationFrame(()=> drawFrame(canvas_v.canvas, canvas_v.content2d, video_1));
                
            });


        })
        .catch(error => {
            console.error('获取屏幕流失败', error);
        });
});


function F创建画布(width: number, height: number) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const content2d = canvas.getContext("2d");

    if (content2d === null) {
        throw new Error("没有2D上下文");
    }



    return {
        canvas,
        content2d
    };
}


function drawFrame(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, video: HTMLVideoElement) {

    if (context === null) {
        throw new Error("2d 绘制上下文是NULL");
    }

    context.drawImage(video, 0, 0);


    var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    invertColors(imageData.data);
    context.putImageData(imageData, 0, 0);

    window.requestAnimationFrame(()=> drawFrame(canvas, context, video));
}


function invertColors(data: Uint8ClampedArray) {
    for (var i = 0; i < data.length; i += 4) {
        data[i] = data[i] ^ 255; // Invert Red
        data[i + 1] = data[i + 1] ^ 255; // Invert Green
        data[i + 2] = data[i + 2] ^ 255; // Invert Blue
    }
}
