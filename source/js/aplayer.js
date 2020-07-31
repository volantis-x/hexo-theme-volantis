// 设置全局播放器所对应的 aplyer 对象
function setGlobalAplayer() {
	window.AplayerFlag = false;
	if(window.Aplayer_ID == undefined) return;
	document.querySelectorAll('meting-js').forEach((item, index)=>{
		if (item.meta.id == window.Aplayer_ID) {
			if (document.querySelectorAll('meting-js')[index].aplayer != undefined) {
				window.AplayerObject = document.querySelectorAll('meting-js')[index].aplayer;
				window.AplayerFlag = true;  // 通过此值判断是否设置成功
			}
		}
	})
}

// 检查 Aplayer 对象状态
function checkAplayer() {
	let flag = window.AplayerFlag == undefined ? false : window.AplayerFlag;
	if (!flag) {
		setGlobalAplayer();
	}
	let linster = window.aplayerLinster == undefined ? false : window.aplayerLinster;
	if (!linster) {
		aplayerOn();
	}
}

// 播放/暂停
function aplayerToggle() {
	checkAplayer();
	try {
		window.AplayerObject.toggle();
	} catch (error) {
		console.log(error);
	}
}

// 上一曲
function aplayerBackward() {
	checkAplayer();
	try {
		window.AplayerObject.skipBack();
		window.AplayerObject.play();
	} catch (error) {
		console.log(error);
	}
}

// 下一曲
function aplayerForward() {
	checkAplayer();
	try {
		window.AplayerObject.skipForward();
		window.AplayerObject.play();
	} catch (error) {
		console.log(error);
	}
}

// 调节音量
function aplayerVolume(percent) {
	checkAplayer();
	try {
		window.AplayerObject.volume(percent);
		window.AplayerObject.play();
	} catch (error) {
		console.log(error);
	}
}

// 事件监听
function aplayerOn() {
	window.aplayerLinster = true;
	try {
		window.AplayerObject.on('play', function (e) {
			document.getElementsByClassName('nav toggle')[0].children[0].classList.remove("fa-play");
			document.getElementsByClassName('nav toggle')[0].children[0].classList.add("fa-pause");
		});
		window.AplayerObject.on('pause', function (e) {
			document.getElementsByClassName('nav toggle')[0].children[0].classList.add("fa-play");
			document.getElementsByClassName('nav toggle')[0].children[0].classList.remove("fa-pause");
		});
	} catch (error) {
		delete window.aplayerLinster;
		checkAplayer();
	}
}
