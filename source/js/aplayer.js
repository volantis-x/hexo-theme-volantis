// 播放/暂停
function aplayerToggle() {
	let ap = document.querySelector('meting-js').aplayer;
	if (ap != undefined) {
		ap.toggle();
	}
}

// 上一曲
function aplayerBackward() {
	let ap = document.querySelector('meting-js').aplayer;
	if (ap != undefined) {
		ap.skipBack();
		ap.play();
	}
}

// 下一曲
function aplayerForward() {
	let ap = document.querySelector('meting-js').aplayer;
	if (ap != undefined) {
		ap.skipForward();
		ap.play();
	}
}

// 调节音量
function aplayerVolume(percent) {
	let ap = document.querySelector('meting-js').aplayer;
	if (ap != undefined) {
		ap.volume(percent);
	}
}
