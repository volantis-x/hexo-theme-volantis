// 检查 Aplayer 对象状态
function checkAPlayer() {
	if (APlayerController.aplayer == undefined) {
		setAPlayerObject();
	} else {
		if (APlayerController.observer == undefined) {
			setAPlayerObserver();
		}
	}
}

// 设置全局播放器所对应的 aplyer 对象
function setAPlayerObject() {
	if (APlayerController.id == undefined) return;
	document.querySelectorAll('meting-js').forEach((item, index)=>{
		if (item.meta.id == APlayerController.id) {
			if (document.querySelectorAll('meting-js')[index].aplayer != undefined) {
 				APlayerController.aplayer = document.querySelectorAll('meting-js')[index].aplayer;
				setAPlayerObserver();
			}
		}
	})
}

// 事件监听
function setAPlayerObserver() {
	try {
		APlayerController.aplayer.on('play', function (e) {
			updateAPlayerControllerStatus();
		});
		APlayerController.aplayer.on('pause', function (e) {
			updateAPlayerControllerStatus();
		});
		APlayerController.aplayer.on('volumechange', function (e) {
			onUpdateAPlayerVolume();
		});

		// 监听音量手势
		APlayerController.volumeBarWrap = document.getElementsByClassName('nav volume')[0].children[0];
		APlayerController.volumeBar = APlayerController.volumeBarWrap.children[0]
		function updateAPlayerVolume(e) {
			let percentage = ((e.clientX || e.changedTouches[0].clientX) - APlayerController.volumeBar.getBoundingClientRect().left) / APlayerController.volumeBar.clientWidth;
			percentage = Math.max(percentage, 0);
			percentage = Math.min(percentage, 1);
			APlayerController.aplayer.volume(percentage);
		}
		const thumbMove = (e) => {
				updateAPlayerVolume(e);
	  };
	  const thumbUp = (e) => {
	      APlayerController.volumeBarWrap.classList.remove('aplayer-volume-bar-wrap-active');
	      document.removeEventListener('mouseup', thumbUp);
	      document.removeEventListener('mousemove', thumbMove);
	      updateAPlayerVolume(e);
	  };

	  APlayerController.volumeBarWrap.addEventListener('mousedown', () => {
	      APlayerController.volumeBarWrap.classList.add('aplayer-volume-bar-wrap-active');
	      document.addEventListener('mousemove', thumbMove);
	      document.addEventListener('mouseup', thumbUp);
	  });


		// 设置完监听就立即更新一次
		updateAPlayerControllerStatus();
		onUpdateAPlayerVolume();
		APlayerController.observer = true;
		console.log('APlayerController ready!');

	} catch (error) {
		delete APlayerController.observer;
	}
}

// 更新控制器状态
function updateAPlayerControllerStatus() {
	try {
		if (APlayerController.aplayer.audio.paused) {
			document.getElementsByClassName('nav toggle')[0].children[0].classList.add("fa-play");
			document.getElementsByClassName('nav toggle')[0].children[0].classList.remove("fa-pause");
		} else {
			document.getElementsByClassName('nav toggle')[0].children[0].classList.remove("fa-play");
			document.getElementsByClassName('nav toggle')[0].children[0].classList.add("fa-pause");
		}
	} catch (error) {
		console.log(error);
	}
}
function onUpdateAPlayerVolume() {
	try {
		APlayerController.volumeBar.children[0].style.width = APlayerController.aplayer.audio.volume * 100 + '%'
	} catch (error) {
		console.log(error);
	}
}

// 播放/暂停
function aplayerToggle() {
	checkAPlayer();
	try {
		APlayerController.aplayer.toggle();
	} catch (error) {
		console.log(error);
	}
}

// 上一曲
function aplayerBackward() {
	checkAPlayer();
	try {
		APlayerController.aplayer.skipBack();
		APlayerController.aplayer.play();
	} catch (error) {
		console.log(error);
	}
}

// 下一曲
function aplayerForward() {
	checkAPlayer();
	try {
		APlayerController.aplayer.skipForward();
		APlayerController.aplayer.play();
	} catch (error) {
		console.log(error);
	}
}

// 调节音量
function aplayerVolume(percent) {
	checkAPlayer();
	try {
		APlayerController.aplayer.volume(percent);
	} catch (error) {
		console.log(error);
	}
}
// 调节音量 测试
function aplayerVolumeToggle() {
	// checkAPlayer();
	// try {
	// 	if (APlayerController.aplayer.audio.volume == 0) {
	// 		aplayerVolume(0.7);
	// 	} else {
	// 		aplayerVolume(0);
	// 	}
	// } catch (error) {
	// 	console.log(error);
	// }
}

(function ($) {
	// 网速快
	checkAPlayer();
	// 网速一般
	setTimeout(function(){
		checkAPlayer();
	}, 3000);
	// 网速较慢
	setTimeout(function(){
		checkAPlayer();
	}, 10000);


})(jQuery);
