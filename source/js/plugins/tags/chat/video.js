function videoEvents(videos) {
    for (let i = 0; i < videos.length; ++i) {
        let video = videos[i];
        video.loop = false;
        let videoDom = video.parentElement;
        let pauseBtn = videoDom.querySelector('.pause-btn');
        let playBtn = videoDom.querySelector('.play-btn');
        // videoDom.addEventListener('click', ()=>{
        //     if (pauseBtn.style.display === 'flex') {
        //         video.pause();
        //         pauseBtn.style.display = "none";
        //         playBtn.style.display = "flex";
        //         playFlag = false;
        //     } else {
        //         if (video.requestFullscreen) {
        //             video.requestFullscreen();
        //         } else if (video.mozRequestFullScreen) {
        //             video.mozRequestFullScreen();
        //         } else if (video.webkitRequestFullScreen) {
        //             video.webkitRequestFullScreen();
        //         } else if (video.msRequestFullscreen) {
        //             video.msRequestFullscreen();
        //         }
        //         video.play();
        //         pauseBtn.style.display = "flex";
        //         playBtn.style.display = "none";
        //         playFlag = true;
        //     }
        // });

        // video.addEventListener('ended', ()=>{
        //     pauseBtn.style.display = "none";
        //     playBtn.style.display = "flex";
        // });

        videoDom.addEventListener('click', ()=>{
            if (video.requestFullscreen) {
                video.requestFullscreen();
            } else if (video.mozRequestFullScreen) {
                video.mozRequestFullScreen();
            } else if (video.webkitRequestFullScreen) {
                video.webkitRequestFullScreen();
            } else if (video.msRequestFullscreen) {
                video.msRequestFullscreen();
            }
        });


        document.addEventListener('fullscreenchange', () => {
            if (checkIsFullScreen()) {
                console.log("进入全屏");
                video.play();
            } else {
                console.log("退出全屏");
                video.currentTime = 0;			// 更改当前播放的时间点
                video.pause();
            }
        });
        function checkIsFullScreen(){
            var isFullScreen = document.fullscreen || document.mozFullScreen || document.webkitIsFullScreen;
            return isFullScreen == undefined ? false : isFullScreen;
        }
    }
}
