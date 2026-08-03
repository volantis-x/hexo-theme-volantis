/**该方法用来绘制一个有填充色的圆角矩形 
    *@param cxt:canvas的上下文环境 
    *@param x:左上角x轴坐标 
    *@param y:左上角y轴坐标 
    *@param width:矩形的宽度 
    *@param height:矩形的高度 
    *@param radius:圆的半径 
    *@param fillColor:填充颜色 
**/
function fillRoundRect(cxt, x, y, width, height, radius, /*optional*/ fillColor) {
    //圆的直径必然要小于矩形的宽高          
    if (2 * radius > width || 2 * radius > height) { return false; }

    cxt.save();
    cxt.translate(x, y);
    //绘制圆角矩形的各个边  
    drawRoundRectPath(cxt, width, height, radius);
    cxt.fillStyle = fillColor || "#000"; //若是给定了值就用给定的值否则给予默认值  
    cxt.fill();
    cxt.restore();
}


/**该方法用来绘制圆角矩形 
    *@param cxt:canvas的上下文环境 
    *@param x:左上角x轴坐标 
    *@param y:左上角y轴坐标 
    *@param width:矩形的宽度 
    *@param height:矩形的高度 
    *@param radius:圆的半径 
    *@param lineWidth:线条粗细 
    *@param strokeColor:线条颜色 
**/
function strokeRoundRect(cxt, x, y, width, height, radius, /*optional*/ lineWidth, /*optional*/ strokeColor) {
    //圆的直径必然要小于矩形的宽高          
    if (2 * radius > width || 2 * radius > height) { return false; }

    cxt.save();
    cxt.translate(x, y);
    //绘制圆角矩形的各个边  
    drawRoundRectPath(cxt, width, height, radius);
    cxt.lineWidth = lineWidth || 2; //若是给定了值就用给定的值否则给予默认值2  
    cxt.strokeStyle = strokeColor || "#000";
    cxt.stroke();
    cxt.restore();
}

function drawRoundRectPath(cxt, width, height, radius) {
    cxt.beginPath(0);
    //从右下角顺时针绘制，弧度从0到1/2PI  
    cxt.arc(width - radius, height - radius, radius, 0, Math.PI / 2);

    //矩形下边线  
    cxt.lineTo(radius, height);

    //左下角圆弧，弧度从1/2PI到PI  
    cxt.arc(radius, height - radius, radius, Math.PI / 2, Math.PI);

    //矩形左边线  
    cxt.lineTo(0, radius);

    //左上角圆弧，弧度从PI到3/2PI  
    cxt.arc(radius, radius, radius, Math.PI, Math.PI * 3 / 2);

    //上边线  
    cxt.lineTo(width - radius, 0);

    //右上角圆弧  
    cxt.arc(width - radius, radius, radius, Math.PI * 3 / 2, Math.PI * 2);

    //右边线  
    cxt.lineTo(width, height - radius);
    cxt.closePath();
}

function fillRoundRectPro(cxt, x, y, width, height, topLeftRadius, topRightRadius, bottomRightRadius, bottomLeftRadius, /*optional*/ fillColor) {
    //圆的直径必然要小于矩形的宽高          
    if (topLeftRadius +  topRightRadius > width || 
    bottomLeftRadius +  bottomRightRadius > width || 
    topLeftRadius +  bottomLeftRadius > height || 
    topRightRadius +  bottomRightRadius > height) { 
        return false; 
    }

    cxt.save();
    cxt.translate(x, y);
    //绘制圆角矩形的各个边  
    drawRoundRectPathPro(cxt, width, height, topLeftRadius, topRightRadius, bottomRightRadius, bottomLeftRadius);
    cxt.fillStyle = fillColor || "#000"; //若是给定了值就用给定的值否则给予默认值  
    cxt.fill();
    cxt.restore();
}

function drawRoundRectPathPro(cxt, width, height, topLeftRadius, topRightRadius, bottomRightRadius, bottomLeftRadius) {
    cxt.beginPath(0);
    //从右下角顺时针绘制，弧度从0到1/2PI  
    cxt.arc(width - bottomRightRadius, height - bottomRightRadius, bottomRightRadius, 0, Math.PI / 2);

    //矩形下边线  
    cxt.lineTo(bottomLeftRadius, height);

    //左下角圆弧，弧度从1/2PI到PI  
    cxt.arc(bottomLeftRadius, height - bottomLeftRadius, bottomLeftRadius, Math.PI / 2, Math.PI);

    //矩形左边线  
    cxt.lineTo(0, topLeftRadius);

    //左上角圆弧，弧度从PI到3/2PI  
    cxt.arc(topLeftRadius, topLeftRadius, topLeftRadius, Math.PI, Math.PI * 3 / 2);

    //上边线  
    cxt.lineTo(width - topRightRadius, 0);

    //右上角圆弧  
    cxt.arc(width - topRightRadius, topRightRadius, topRightRadius, Math.PI * 3 / 2, Math.PI * 2);

    //右边线  
    cxt.lineTo(width, height - bottomRightRadius);
    cxt.closePath();
}

function drawWave(context, audioHeight, waveHeightArr, radius, waveColor) {
    //绘制wave
    for (let i = 0; i < waveHeightArr.length; ++i) {
        fillRoundRect(context, 4 * i, (audioHeight - waveHeightArr[i]) / 2, 2, waveHeightArr[i], radius, waveColor);
    }
}

function drawWaveWhenPlaying(context, audioHeight, playLineX, waveHeightArr, radius, activeWaveColor, inactiveWaveColor) {
    //绘制wave
    for (let i = 0; i < waveHeightArr.length; ++i) {
        if (4 * i + 2 <= playLineX) {
            fillRoundRect(context, 4 * i, (audioHeight - waveHeightArr[i]) / 2, 2, waveHeightArr[i], radius, activeWaveColor);
        } else if (4 * i >= playLineX) {
            fillRoundRect(context, 4 * i, (audioHeight - waveHeightArr[i]) / 2, 2, waveHeightArr[i], radius, inactiveWaveColor);
        } else {
            if (playLineX - 4 * i >= 1) {
                fillRoundRect(context, 4 * i, (audioHeight - waveHeightArr[i]) / 2, 2, waveHeightArr[i], radius, inactiveWaveColor);
                fillRoundRectPro(context, 4 * i, (audioHeight - waveHeightArr[i]) / 2, playLineX - 4 * i, waveHeightArr[i], radius, 0, 0, radius, activeWaveColor);
            } else {
                fillRoundRect(context, 4 * i, (audioHeight - waveHeightArr[i]) / 2, 2, waveHeightArr[i], radius, activeWaveColor);
                fillRoundRectPro(context, 4 * i, (audioHeight - waveHeightArr[i]) / 2, 2 - playLineX + 4 * i, waveHeightArr[i], 0, radius, radius, 0, inactiveWaveColor);
            }
        }
        
    }
}

function drawPlayLine(context, playLineHeight, playLineX, playLineColor) {
    // 绘制 playLine
    fillRoundRect(context, playLineX, 0, 1, playLineHeight, 0.1, playLineColor);
}

function createVoiceDom(audios) {
    for (let i = 0; i < audios.length; ++i) {
        let audio = audios[i];
        audio.loop = false;
        let currentTime = audio.currentTime // 当前播放时间

        if (audio.classList.contains('qq')) {
            if (isNaN(audio.duration) || audio.duration === Infinity) {
                audio.addEventListener('durationchange', ()=>{
                    // createCssStyle(audio, i);
                    createWaveDom(audio);
                });
            } else {
                // createCssStyle(audio, i);
                createWaveDom(audio);
            }
        } else if (audio.classList.contains('wechat')) {
            if (isNaN(audio.duration) || audio.duration === Infinity) {
                audio.addEventListener('durationchange', ()=>{
                    createWechatVoiceDom(audio);
                });
            } else {
                createWechatVoiceDom(audio);
            }
        }
    }
}

// cancas 效果更好
function createWaveDom(audio) {
    let voiceDom = audio.parentElement;
    let audioCanvas = voiceDom.querySelector('canvas');
    if (audioCanvas.getContext("2d")) { //判断浏览器是否支持canvas标签  
        let totalTime = audio.duration;
        let totalTimeInt = Math.floor(totalTime);
        let spanNum = totalTimeInt + 2 > 25 ? 25 : totalTimeInt + 2;  // 防止过多溢出容器而导致被hidden切割边缘
    
        let pauseBtn = voiceDom.querySelector('.pause-btn');
        let playBtn = voiceDom.querySelector('.play-btn');
        let voiceSecondsSpan = voiceDom.querySelector('.voice-seconds');

        voiceSecondsSpan.innerHTML = `${totalTimeInt > 60 ? '..' : totalTimeInt}"`;

        let dpr = window.devicePixelRatio;

        //设置canvas的宽度和高度  
        audioCanvas.width = (spanNum * 2 - 1) * 2 * dpr;
        audioCanvas.height = 23 * dpr;

        audioCanvas.style.width = (spanNum * 2 - 1) * 2 + 'px';
        audioCanvas.style.height = 23 + 'px';

        let waveHeightArr = [];
        for (let i = 0; i < spanNum; ++i) {
            // (Math.floor(Math.random()*(100-10+1))+10) [10, 100]之间的随机整数
            let h = (Math.floor(Math.random()*(80-30+1))+30) / 100 * audioCanvas.height * 0.8;
            waveHeightArr.push(h);
        }

        var context = audioCanvas.getContext("2d"); //获取画布context的上下文环境 
        context.scale(dpr, 1);

        let activeWaveColor = '#333';
        let inactiveWaveColor = '#999';

        if (audioCanvas.classList.contains('right')) {
            activeWaveColor = '#ffffff';
            inactiveWaveColor = '#1373b3';
        }

        if (utils.dark.mode === "dark") {
            activeWaveColor = '#ccc';
            inactiveWaveColor = '#707070';
            if (audioCanvas.classList.contains('right')) {
                activeWaveColor = '#fff9';
                inactiveWaveColor = '#6797b780';
            }
        }

        let playFlag = false;

        //绘制wave
        drawWave(context,audioCanvas.height,waveHeightArr,1,activeWaveColor);

        audio.addEventListener('timeupdate', ()=>{
            if (audio.currentTime > 0) {
                if (utils.dark.mode === "dark") {
                    activeWaveColor = '#ccc';
                    inactiveWaveColor = '#707070';
                    if (audioCanvas.classList.contains('right')) {
                        activeWaveColor = '#fff9';
                        inactiveWaveColor = '#6797b780';
                    }
                } else {
                    activeWaveColor = '#333';
                    inactiveWaveColor = '#999';
                    if (audioCanvas.classList.contains('right')) {
                        activeWaveColor = '#ffffff';
                        inactiveWaveColor = '#1373b3';
                    }
                }
                utils.requestAnimationFrame(()=>{
                    context.clearRect(0, 0, audioCanvas.width, audioCanvas.height);
                    drawWaveWhenPlaying(context,audioCanvas.height,(audio.currentTime / audio.duration) * audioCanvas.width / dpr,waveHeightArr,1,activeWaveColor,inactiveWaveColor);
                    drawPlayLine(context,audioCanvas.height,(audio.currentTime / audio.duration / dpr) * audioCanvas.width,activeWaveColor);
                });
            }
        });

        audio.addEventListener('ended', ()=>{
            audio.pause();
            pauseBtn.style.display = "none";
            playBtn.style.display = "flex";
            audio.currentTime = 0;
            utils.requestAnimationFrame(()=>{
                context.clearRect(0, 0, audioCanvas.width, audioCanvas.height);
                drawWave(context,audioCanvas.height,waveHeightArr,1,activeWaveColor);
            });
            playFlag = false;
        });
        voiceDom.addEventListener('click', ()=>{
            if (pauseBtn.style.display === 'flex') {
                audio.pause();
                pauseBtn.style.display = "none";
                playBtn.style.display = "flex";
                playFlag = false;
            } else {
                audio.play();
                pauseBtn.style.display = "flex";
                playBtn.style.display = "none";
                playFlag = true;
            }
        });

        utils.dark.push(function () {
            if (!playFlag) {
                if (utils.dark.mode === "dark") {
                    activeWaveColor = '#ccc';
                    inactiveWaveColor = '#707070';
                    if (audioCanvas.classList.contains('right')) {
                        activeWaveColor = '#fff9';
                        inactiveWaveColor = '#6797b780';
                    }
                } else {
                    activeWaveColor = '#333';
                    inactiveWaveColor = '#999';
                    if (audioCanvas.classList.contains('right')) {
                        activeWaveColor = '#ffffff';
                        inactiveWaveColor = '#1373b3';
                    }
                }
                if (audio.currentTime > 0) {
                    utils.requestAnimationFrame(()=>{
                        context.clearRect(0, 0, audioCanvas.width, audioCanvas.height);
                        drawWaveWhenPlaying(context,audioCanvas.height,(audio.currentTime / audio.duration) * audioCanvas.width / dpr,waveHeightArr,1,activeWaveColor,inactiveWaveColor);
                        drawPlayLine(context,audioCanvas.height,(audio.currentTime / audio.duration / dpr) * audioCanvas.width,activeWaveColor);
                    });
                } else {
                    utils.requestAnimationFrame(()=>{
                        context.clearRect(0, 0, audioCanvas.width, audioCanvas.height);
                        drawWave(context,audioCanvas.height,waveHeightArr,1,activeWaveColor);
                    });
                }
            }
        });
        
    } else {
        console.log("浏览器不支持canvas");
    }
}

// transition 效果差一些
function createCssStyle(audio, i) {
    let totalTime = audio.duration;
    let totalTimeInt = Math.floor(totalTime);
    let spanNum = totalTimeInt + 2 > 25 ? 25 : totalTimeInt + 2;  // 防止过多溢出容器而导致被hidden切割边缘

    let voiceDom = audio.parentElement;
    let pauseBtn = voiceDom.querySelector('.pause-btn');
    let playBtn = voiceDom.querySelector('.play-btn');
    let voiceSecondsSpan = voiceDom.querySelector('.voice-seconds');

    voiceSecondsSpan.innerHTML = `${totalTimeInt > 60 ? '..' : totalTimeInt}"`;

    let width = (2 * spanNum - 1) * 2;

    if (totalTimeInt + 2 > 25) {
        voiceDom.style.width = '100%';
    }

    let waveDiv = document.createElement('div');
    let playLineDiv = document.createElement('div');
    playLineDiv.className = 'play-line';
    waveDiv.append(playLineDiv);
    waveDiv.className = `voice-wave voice-wave-${i + 1}`;
    for (let j = 0; j < spanNum; j++) {
        let itemSpan = document.createElement('span');
        itemSpan.className = 'voice-wave-item';
        waveDiv.append(itemSpan)
    }
    voiceDom.insertBefore(waveDiv, voiceDom.querySelector('.voice-metas'));

    audio.addEventListener('ended', ()=>{
        audio.pause();
        pauseBtn.style.display = "none";
        playBtn.style.display = "flex";
        audio.currentTime = 0;
        playLineDiv.classList.remove('active');
        playLineDiv.classList.add('back');
    });
    voiceDom.addEventListener('click', ()=>{
        if (pauseBtn.style.display === 'flex') {
            audio.pause();
            pauseBtn.style.display = "none";
            playBtn.style.display = "flex";
            audio.currentTime = 0;
            playLineDiv.classList.remove('active');
            playLineDiv.classList.add('back');
        } else {
            audio.play();
            pauseBtn.style.display = "flex";
            playBtn.style.display = "none";
            playLineDiv.classList.add('active');
            playLineDiv.classList.remove('back');
        }
    });

    let audio_css_str = `
    .voice-wave.voice-wave-${i + 1}>.play-line {
        transition: transform ${totalTime}s linear;
        -moz-transition: transform ${totalTime}s linear;
        -webkit-transition: transform ${totalTime}s linear;
        -o-transition: transform ${totalTime}s linear;
    }
    .voice-wave.voice-wave-${i + 1}>.play-line.active {
        transform: translateX(${width}px);
    }
    `;
    for (let j = 0; j < spanNum; ++j) {
        audio_css_str += `
        .voice-wave-${i + 1} span.voice-wave-item:nth-child(${j + 1}) {
            height: ${(Math.floor(Math.random() * (10 - 3 + 1)) + 3) * 10}%;
            margin-left: ${j == 0 ? 0 : 2}px;
        }
        `;
    }
    let style_voice_wave = document.createElement('style');
    style_voice_wave.setAttribute('type', 'text/css');
    style_voice_wave.innerHTML = audio_css_str;
    document.getElementsByTagName('head').item(0).appendChild(style_voice_wave);
}

function createWechatVoiceDom(audio) {
    let voiceDom = audio.parentElement;
    let wechatVoice = voiceDom.querySelector('.wechat-voice');

    let totalTime = audio.duration;
    let totalTimeInt = Math.floor(totalTime);

    let voiceSecondsSpan = voiceDom.querySelector('.voice-seconds');
    voiceSecondsSpan.innerHTML = `${totalTimeInt > 60 ? '..' : totalTimeInt}"`;

    let voicePlaceholderDiv = voiceDom.querySelector('.voice-placeholder');
    voicePlaceholderDiv.style.width = totalTimeInt * 2 + 'px';

    let playFlag = false;

    audio.addEventListener('ended', ()=>{
        audio.pause();
        wechatVoice.classList.remove('play');
        audio.currentTime = 0;
        playFlag = false;
    });
    voiceDom.addEventListener('click', ()=>{
        if (playFlag) {
            audio.pause();
            wechatVoice.classList.remove('play');
            playFlag = false;
        } else {
            audio.play();
            wechatVoice.classList.add('play');
            playFlag = true;
        }
    });
}
