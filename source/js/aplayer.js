// 播放
function aplayerPlay() {
	var canplay = getCookie('canplay');
	if (canplay == null || canplay == 'true') {
		document.querySelector('meting-js').aplayer.play();
		if (document.getElementById('aplayerPlay').style.display != 'none') {
			document.getElementById("aplayerPlay").style.display = 'none';
			document.getElementById("aplayerPause").style.display = '';
		}
	}
}
// 暂停
function aplayerPause() {
	var canplay = getCookie('canplay');
	if (canplay == null || canplay == 'true') {
		document.querySelector('meting-js').aplayer.pause();
		if (document.getElementById('aplayerPause').style.display != 'none') {
			document.getElementById("aplayerPause").style.display = 'none';
			document.getElementById("aplayerPlay").style.display = '';
		}
		var index = document.querySelector('meting-js').aplayer.list.index;
		var title = document.querySelector('meting-js').aplayer.list.audios[index].title;
		var artist = document.querySelector('meting-js').aplayer.list.audios[index].artist;
	}
}
// 下一首
function aplayerBackward() {
	var canplay = getCookie('canplay');
	if (canplay == null || canplay == 'true') {
		document.querySelector('meting-js').aplayer.skipBack();
		document.querySelector('meting-js').aplayer.play();
		if (document.getElementById('aplayerPlay').style.display != 'none') {
			document.getElementById("aplayerPlay").style.display = 'none';
			document.getElementById("aplayerPause").style.display = '';
		}
	}
}
// 上一首
function aplayerForward() {
	var canplay = getCookie('canplay');
	if (canplay == null || canplay == 'true') {
		document.querySelector('meting-js').aplayer.skipForward();
		document.querySelector('meting-js').aplayer.play();
		if (document.getElementById('aplayerPlay').style.display != 'none') {
			document.getElementById("aplayerPlay").style.display = 'none';
			document.getElementById("aplayerPause").style.display = '';
		}
	}
}
// 调节音量
function aplayerVolume(percent) {
	let ap = document.querySelector('meting-js').aplayer;
	if (ap != undefined) {
		ap.volume(percent);
	}
}
