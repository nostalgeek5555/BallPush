////////////////////////////////////////////////////////////
// CANVAS LOADER
////////////////////////////////////////////////////////////

 /*!
 * 
 * START CANVAS PRELOADER - This is the function that runs to preload canvas asserts
 * 
 */
function initPreload(){
	toggleLoader(true);
	checkMobileEvent();
	
	$(window).resize(function(){
		resizeGameFunc();
	});
	resizeGameFunc();
	
	loader = new createjs.LoadQueue(false);
	manifest=[{src:'assets/background.jpg',id:'background'},
			{src:'assets/logo.png', id:'logo'},
			{src:'assets/chair.png', id:'chair'},
			{src:'assets/table_side.png', id:'tableSide'},
			{src:'assets/table_top.png', id:'tableTop'},
			{src:'assets/table_end.png', id:'tableEnd'},
			{src:'assets/table_target.png', id:'tableTarget'},
			{src:'assets/boards.png', id:'boards'},
			{src:'assets/iconBeer.png', id:'iconBeer'},
			{src:'assets/swipeArrow.png', id:'swipeArrow'},
			{src:'assets/button_share.png', id:'buttonShare'},
			{src:'assets/button_save.png', id:'buttonSave'},
			{src:'assets/social/button_facebook.png', id:'buttonFacebook'},
			{src:'assets/social/button_twitter.png', id:'buttonTwitter'},
			{src:'assets/social/button_whatsapp.png', id:'buttonWhatsapp'},
			{src:'assets/social/button_telegram.png', id:'buttonTelegram'},
			{src:'assets/social/button_reddit.png', id:'buttonReddit'},
			{src:'assets/social/button_linkedin.png', id:'buttonLinkedin'},
			
			{src:'assets/distanceBg.png', id:'distanceBg'},
			
			{src:'assets/button_confirm.png', id:'buttonConfirm'},
			{src:'assets/button_cancel.png', id:'buttonCancel'},
			{src:'assets/item_exit.png', id:'itemExit'},
			{src:'assets/button_fullscreen.png', id:'buttonFullscreen'},
			{src:'assets/button_sound_on.png', id:'buttonSoundOn'},
			{src:'assets/button_sound_off.png', id:'buttonSoundOff'},
			{src:'assets/button_music_on.png', id:'buttonMusicOn'},
			{src:'assets/button_music_off.png', id:'buttonMusicOff'},
			{src:'assets/button_exit.png', id:'buttonExit'},
			{src:'assets/button_settings.png', id:'buttonSettings'}];
			
	for(n=0;n<mugs_arr.length;n++){
		manifest.push({src:mugs_arr[n].src, id:'beer'+n})	
	}
	
	if ( typeof addScoreboardAssets == 'function' ) { 
		addScoreboardAssets();
	}
	
	audioOn = true;
	if(!isDesktop){
		if(!enableMobileAudio){
			audioOn=false;
		}
	}else{
		if(!enableDesktopAudio){
			audioOn=false;
		}
	}
	
	if(audioOn){
		manifest.push({src:'assets/sounds/music.ogg', id:'music'})
		manifest.push({src:'assets/sounds/button.ogg', id:'soundButton'})
		manifest.push({src:'assets/sounds/end.ogg', id:'soundEnd'})
		manifest.push({src:'assets/sounds/score.ogg', id:'soundScore'})
		manifest.push({src:'assets/sounds/fail.ogg', id:'soundFail'})
		manifest.push({src:'assets/sounds/breaking.ogg', id:'soundBreaking'})
		manifest.push({src:'assets/sounds/drop.ogg', id:'soundDrop'})
		manifest.push({src:'assets/sounds/sliding_fast.ogg', id:'soundSlidingFast'})
		manifest.push({src:'assets/sounds/sliding_slow.ogg', id:'soundSlidingSlow'})
		
		createjs.Sound.alternateExtensions = ["mp3"];
		loader.installPlugin(createjs.Sound);
	}
	
	loader.addEventListener("complete", handleComplete);
	loader.on("progress", handleProgress, this);
	loader.loadManifest(manifest);
}

/*!
 * 
 * CANVAS PRELOADER UPDATE - This is the function that runs to update preloder progress
 * 
 */
function handleProgress() {
	$('#mainLoader span').html(Math.round(loader.progress/1*100)+'%');
}

/*!
 * 
 * CANVAS PRELOADER COMPLETE - This is the function that runs when preloader is complete
 * 
 */
function handleComplete() {
	toggleLoader(false);
	initMain();
};

/*!
 * 
 * TOGGLE LOADER - This is the function that runs to display/hide loader
 * 
 */
function toggleLoader(con){
	if(con){
		$('#mainLoader').show();
	}else{
		$('#mainLoader').hide();
	}
}