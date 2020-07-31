
function menuPlay() {
	var canplay = getCookie('canplay');
	if (canplay == null || canplay == 'true') {
		document.querySelector('meting-js').aplayer.play();
	}
}

function menuPause() {
	var canplay = getCookie('canplay');
	if (canplay == null || canplay == 'true') {
		document.querySelector('meting-js').aplayer.pause();
		var index = document.querySelector('meting-js').aplayer.list.index;
		var title = document.querySelector('meting-js').aplayer.list.audios[index].title;
		var artist = document.querySelector('meting-js').aplayer.list.audios[index].artist;
	}
}

function menuBackward() {
	var canplay = getCookie('canplay');
	if (canplay == null || canplay == 'true') {
		document.querySelector('meting-js').aplayer.skipBack();
		document.querySelector('meting-js').aplayer.play();
	}
}

function menuForward() {
	var canplay = getCookie('canplay');
	if (canplay == null || canplay == 'true') {
		document.querySelector('meting-js').aplayer.skipForward();
		document.querySelector('meting-js').aplayer.play();
	}
}
