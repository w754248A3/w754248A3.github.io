(()=>{"use strict";const e=document.getElementById("videoPlayer"),t=document.getElementById("startRecording"),a=document.getElementById("stopRecording");let d,o;t.addEventListener("click",(()=>{t.disabled=!0,a.disabled=!1,o=[],navigator.mediaDevices.getDisplayMedia({video:!0,audio:!0}).then((t=>{e.srcObject=t,e.controls=!1,e.muted=!0,e.autoplay=!0,d=new MediaRecorder(t),d.ondataavailable=e=>{e.data&&e.data.size>0&&o.push(e.data)},d.onstop=function(){t.getTracks().forEach((e=>e.stop()));const a=new Blob(o,{type:"video/webm"}),d=URL.createObjectURL(a);e.controls=!0,e.muted=!1,e.srcObject=null,e.src=d,e.play()},d.start()})).catch((e=>{console.error("获取屏幕流失败",e)}))})),a.addEventListener("click",(()=>{a.disabled=!0,t.disabled=!1,d.stop()}))})();