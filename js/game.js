////////////////////////////////////////////////////////////
// GAME v1.7
////////////////////////////////////////////////////////////

/*!
 * 
 * GAME SETTING CUSTOMIZATION START
 * 
 */
const startButtonText = 'Start'; //text for start button
const instructionText = 'Swipe to push...'; //text for game instruction

//mugs array
const mugs_arr = [{src:'assets/mug1.png', weight:.8, width:125},
				{src:'assets/mug2.png', weight:.75, width:125},
				{src:'assets/mug3.png', weight:.7, width:85},
				{src:'assets/mug4.png', weight:.65, width:70}];
				
const chairDistanceNumber = 500; //chair distance number
const totalChances = 5; //total of chances
const textChances = 'x [NUMBER]'; //text for game chances
const textScores = '[NUMBER]pts'; //text for game scores
const textDistance = '[NUMBER]m'; //text for game distance
const panCameraEndOnce = true; //set true to pan camera to end for once only, false for everytime

const level_arr = {distanceStart:300, //distance number for game start
				distanceIncrease:300, //distance number to increase
				targetRange:500, //table end target range
				targetRangeDecrease:10}; //table end target range decrease

const textResultTitle = 'GAME OVER'; //text for game result title
const textResultScore = 'Best score : [NUMBER]pts'; //text for game result title
const replayButtonText = 'Replay'; //text for replay button
const exitMessage = 'Are you sure you want\nto quit the game?'; //quit game message

//Social share, [SCORE] will replace with game score
const shareSettings = {
	enable:true,
	options:['facebook','twitter','whatsapp','telegram','reddit','linkedin'],
	shareTitle:'Highscore on Beer Pushing is [SCORE]pts',
	shareText:'[SCORE]pts is mine new highscore on Beer Pushing! Try it now!',
	customScore:true, //share a custom score to Facebook, it use customize share.php (Facebook and PHP only)
	gtag:true //Google Tag
};

/*!
 *
 * GAME SETTING CUSTOMIZATION END
 *
 */

const playerData = {score:0, chances:3, distance:0, swipe:false};
const gameData = {status:'', beerNum:0, beerCount:0, beerArray:[], speed:0, decreaseSpeed:0, distance:0, updateBackground:false, chairs_arr:[], distanceStart:800, targetRange:0, sound:'none', panCamera:true};
const beerData = {startX:204, startY:430}

/*!
 * 
 * GAME BUTTONS - This is the function that runs to setup button event
 * 
 */
function buildGameButton(){
	$(window).focus(function() {
		if(!buttonSoundOn.visible){
			toggleSoundInMute(false);
		}

		if (typeof buttonMusicOn != "undefined") {
			if(!buttonMusicOn.visible){
				toggleMusicInMute(false);
			}
		}
	});
	
	$(window).blur(function() {
		if(!buttonSoundOn.visible){
			toggleSoundInMute(true);
		}

		if (typeof buttonMusicOn != "undefined") {
			if(!buttonMusicOn.visible){
				toggleMusicInMute(true);
			}
		}
	});

	if(audioOn){
		if(muteSoundOn){
			toggleSoundMute(true);
		}
		if(muteMusicOn){
			toggleMusicMute(true);
		}
	}

	$("#canvasHolder").swipe( {
		swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
			if(direction == 'right' && playerData.swipe && duration < 500){
				pushBeer(distance, duration);
			}
		}
	});
	
	buttonReplay.cursor = "pointer";
	buttonReplay.addEventListener("click", function(evt) {
		playSound('soundButton');
		goPage('game');
	});
	
	if(shareSettings.enable){
		buttonShare.cursor = "pointer";
		buttonShare.addEventListener("click", function(evt) {
			playSound('soundButton');
			toggleSocialShare(true);
		});

		for(let n=0; n<shareSettings.options.length; n++){
			$.share['button'+n].cursor = "pointer";
			$.share['button'+n].addEventListener("click", function(evt) {
				shareLinks(evt.target.shareOption, addCommas(playerData.score));
			});
		}
	};
	
	//confirm
	buttonConfirm.cursor = "pointer";
	buttonConfirm.addEventListener("click", function(evt) {
		playSound('soundClick');
		togglePop(false);
		stopGame(true);
		goPage('main');
	});
	
	buttonCancel.cursor = "pointer";
	buttonCancel.addEventListener("click", function(evt) {
		playSound('soundClick');
		togglePop(false);
	});
	
	itemExit.addEventListener("click", function(evt) {
	});
	
	//options
	buttonSoundOff.cursor = "pointer";
	buttonSoundOff.addEventListener("click", function(evt) {
		toggleSoundMute(true);
	});
	
	buttonSoundOn.cursor = "pointer";
	buttonSoundOn.addEventListener("click", function(evt) {
		toggleSoundMute(false);
	});

	if (typeof buttonMusicOff != "undefined") {
		buttonMusicOff.cursor = "pointer";
		buttonMusicOff.addEventListener("click", function(evt) {
			toggleMusicMute(true);
		});
	}
	
	if (typeof buttonMusicOn != "undefined") {
		buttonMusicOn.cursor = "pointer";
		buttonMusicOn.addEventListener("click", function(evt) {
			toggleMusicMute(false);
		});
	}
	
	buttonFullscreen.cursor = "pointer";
	buttonFullscreen.addEventListener("click", function(evt) {
		toggleFullScreen();
	});
	
	buttonSettings.cursor = "pointer";
	buttonSettings.addEventListener("click", function(evt) {
		toggleOptions();
	});
	
	buttonExit.cursor = "pointer";
	buttonExit.addEventListener("click", function(evt) {
		togglePop(true);
		toggleOptions();
	});
}

function toggleSwipeButton(con){
	if(con){
		$("#canvasHolder").swipe('enable');
	}else{
		$("#canvasHolder").swipe('disable');
	}
}

function setupGameButton(){
	mainContainer.cursor = "pointer";
	mainContainer.addEventListener("click", handlerMethod);
}

function removeGameButton(){
	mainContainer.cursor = null;
	mainContainer.removeEventListener("click", handlerMethod);
}

function handlerMethod(evt) {
	 switch (evt.type){
		 case 'click':
		 	playSound('soundButton');
		 	goPage('game');
		 	break;
	 }
}

/*!
 * 
 * TOGGLE SOCIAL SHARE - This is the function that runs to toggle social share
 * 
 */
function toggleSocialShare(con){
	if(!shareSettings.enable){return;}
	buttonShare.visible = con == true ? false : true;
	shareSaveContainer.visible = con == true ? false : true;
	socialContainer.visible = con;

	if(con){
		if (typeof buttonSave !== 'undefined') {
			TweenMax.to(buttonShare, 3, {overwrite:true, onComplete:toggleSocialShare, onCompleteParams:[false]});
		}
	}
}

function positionShareButtons(){
	if(!shareSettings.enable){return;}
	if (typeof buttonShare !== 'undefined') {
		if (typeof buttonSave !== 'undefined') {
			if(buttonSave.visible){
				buttonShare.x = -((buttonShare.image.naturalWidth/2) + 5);
				buttonSave.x = ((buttonShare.image.naturalWidth/2) + 5);
			}else{
				buttonShare.x = 0;
			}
		}
	}
}

/*!
 * 
 * DISPLAY PAGES - This is the function that runs to display pages
 * 
 */
var curPage=''
function goPage(page){
	curPage=page;
	
	mainContainer.visible=false;
	gameContainer.visible=false;
	resultContainer.visible = false;
	togglePop(false);
	toggleOptions(false);
	
	removeGameButton();
	stopAnimateButton(buttonStartTxt);
	stopAnimateButton(buttonReplay);
	toggleSwipeButton(false);
	
	var targetContainer = ''
	switch(page){
		case 'main':
			targetContainer = mainContainer;
			setupGameButton();
			startAnimateButton(buttonStartTxt);
			
			createBeer();
		break;
		
		case 'game':
			targetContainer = gameContainer;
			startGame();
			toggleSwipeButton(true);
		break;
		
		case 'result':
			targetContainer = resultContainer;
			toggleSocialShare(false);
			startAnimateButton(buttonReplay);
			
			txtResultScore.text = textResultScore.replace('[NUMBER]', playerData.score);
			playSound('soundEnd');
			stopGame();
			saveGame(playerData.score);
		break;
	}
	
	targetContainer.visible=true;
	resizeCanvas();
}

/*!
 * 
 * START ANIMATE BUTTON - This is the function that runs to play blinking animation
 * 
 */
function startAnimateButton(obj){
	obj.alpha=0;
	$(obj)
	.animate({ alpha:1}, 500)
	.animate({ alpha:0}, 500, function(){
		startAnimateButton(obj);	
	});
}

/*!
 * 
 * STOP ANIMATE BUTTON - This is the function that runs to stop blinking animation
 * 
 */
function stopAnimateButton(obj){
	obj.alpha=0;
	$(obj)
	.clearQueue()
	.stop(true,true);
}


/*!
 * 
 * TOGGLE ARROW ANIMATION - This is the function that runs to toggle arrow animation
 * 
 */
function toggleAnimateArrow(obj, con){
	obj.x=canvasW/100 * 38;
	if(con){
		$(obj)
		.animate({ x:canvasW/100 * 42}, 500)
		.animate({ x:canvasW/100 * 38}, 500, function(){
			toggleAnimateArrow(obj, con);	
		});
	}else{
		$(obj)
		.clearQueue()
		.stop(true,false);
	}
}

/*!
 * 
 * START GAME - This is the function that runs to start play game
 * 
 */
function startGame(){
	gameData.panCamera = true;
	playerData.chances = totalChances;
	playerData.score = 0;
	distanceBg.alpha = txtDistance.alpha = 1;
	
	gameData.distanceStart = level_arr.distanceStart;
	gameData.targetRange = level_arr.targetRange;
	
	resetCharis();
	createGame();
}

/*!
 * 
 * CREATE GAME - This is the function that runs to create new game
 * 
 */
function createGame(){
	playerData.swipe = false;
	swipeArrow.alpha = txtInstruction.alpha = 0;
	
	createBeer();
	updateStat();
	animateBeerDrop(true);
}

/*!
 * 
 * RESET CHAIRS - This is the function that remove chairs
 * 
 */
function resetCharis(){
	for(n=0;n<gameData.chairs_arr.length;n++){
		tableContainer.removeChild(gameData.chairs_arr[n]);
	}	
}

 /*!
 * 
 * STOP GAME - This is the function that runs to stop play game
 * 
 */
function stopGame(){
	TweenMax.killTweensOf(playerData);
	TweenMax.killTweensOf(gameData);
	TweenMax.killTweensOf(beer);
	
	gameData.speed = 0;
	gameData.updateBackground = false;
	
	distanceBg.alpha = txtDistance.alpha = 0;
}

 /*!
 * 
 * SAVE GAME - This is the function that runs to save game
 * 
 */
function saveGame(score){
	if ( typeof toggleScoreboardSave == 'function' ) { 
		$.scoreData.score = score;
		if(typeof type != 'undefined'){
			$.scoreData.type = type;	
		}
		toggleScoreboardSave(true);
	}

	/*$.ajax({
      type: "POST",
      url: 'saveResults.php',
      data: {score:score},
      success: function (result) {
          console.log(result);
      }
    });*/
}

 /*!
 * 
 * CREATE NEW BEER - This is the function that runs to create new beer
 * 
 */
function createBeer(){	
	tableContainer.removeChild(beer);
	gameData.beerNum = gameData.beerArray[gameData.beerCount];
	gameData.beerCount++;
	if(gameData.beerCount > gameData.beerArray.length-1){
		gameData.beerCount = 0;
		shuffle(gameData.beerArray);
	}
	beer = $.beers[gameData.beerNum].clone();
	
	beer.x = beerData.startX;
	beer.y = beerData.startY;
	tableContainer.addChild(beer);
	
	beerShadow.graphics.clear();
	beerShadow.graphics.beginFill("black");
 	beerShadow.graphics.drawCircle(0,0,mugs_arr[gameData.beerNum].width/2);
	beerShadow.scaleY = .2;
	beerShadow.alpha = .2;
	beerShadow.x = beer.x;
	beerShadow.y = beer.y;
	
	gameData.distance = canvasW + gameData.distanceStart;
	tableTarget.x = gameData.distance;
	tableEnd.x = gameData.distance+gameData.targetRange;
	
	updateDistance();
	txtDistance.y = canvasH/100 * 46;
	distanceBg.y = canvasH/100 * 44;
	
	var chairStartX = tableEnd.x - chairDistanceNumber;
	var totalChairs = Math.floor(gameData.distance/chairDistanceNumber)+1;
	
	gameData.chairs_arr = [];
	for(n=0;n<totalChairs;n++){
		var newChair = chair.clone();
		newChair.x = chairStartX;
		newChair.y = canvasH/100 * 115;
		gameData.chairs_arr.push(newChair);
		tableContainer.addChild(newChair);
		
		chairStartX -= chairDistanceNumber;
	}
}

 /*!
 * 
 * ANIMATE TABLE AREA - This is the function that runs to pan to target area
 * 
 */
function animateTableTarget(){
	gameData.status = 'focus';
	gameData.updateBackground = true;
	
	beer.oldX = beer.x;
	var cameraTweenSpeed = gameData.distance/1500;
	TweenMax.to(beer, cameraTweenSpeed, {delay:.5, x:-((gameData.distance+gameData.targetRange) - (canvasW)), overwrite:true, onComplete:function(){
		TweenMax.to(beer, cameraTweenSpeed, {delay:.5, x:beerData.startX, overwrite:true, onComplete:function(){
			setActionReady();
		}});
	}});
}

/*!
 * 
 * SET ACTION READY - This is the function that runs to enable swipe action
 * 
 */
function setActionReady(){
	beer.x = beerData.startX;
	beer.y = beerData.startY;
	
	beer.alpha = 1;
	beerShadow.alpha = .2;
	
	gameData.status = 'action';
	gameData.updateBackground = false;
	swipeArrow.alpha = txtInstruction.alpha = 1;
	toggleAnimateArrow(swipeArrow, true);
	playerData.swipe = true;
}

 /*!
 * 
 * GAME LOOP - This is the function that runs to loop game
 * 
 */
function updateGame(event){
	if(gameData.updateBackground){
		beerShadow.x = beer.x;
		
		var stickX = canvasW/100 * 98;
		if(tableTarget.x + (tableTarget.image.naturalWidth/2) < stickX){
			distanceBg.x = tableTarget.x + (tableTarget.image.naturalWidth/2);
		}else{
			distanceBg.x = stickX;
		}
		txtDistance.x = distanceBg.x - 110;
		
		if(gameData.status == 'focus'){
			if(beer.oldX != beer.x){
				gameData.speed = beer.oldX - beer.x;
				beer.oldX = beer.x;
			}else{
				gameData.speed = 0;	
			}
			updateBackground();
		}else{
			playSlidingSound();
			if(tableEnd.x <= canvasW/100 * 80){
				beer.x += gameData.speed;
				
				if(beer.x >= tableEnd.x){
					stopSlidingSound();
					animateBeerFall();
					return;
				}
			}else{
				updateBackground();
			}
			
			if(gameData.speed > 0){
				gameData.speed -= gameData.decreaseSpeed;
			}else{
				gameData.speed = 0;	
				if(beer.x < tableTarget.x){
					checkGameEnd(false);	
				}else{
					updateScore();	
				}
			}
		}
	}
}

 /*!
 * 
 * SLIDING SOUND - This is the function that runs to sliding sound
 * 
 */
function playSlidingSound(){
	if(gameData.speed > 0){
		if(gameData.speed > 10){
			if(gameData.sound != 'fast'){
				gameData.sound = 'fast';
				stopSoundLoop('soundSlidingSlow');
				playSoundLoop('soundSlidingFast');
			}
		}else{
			if(gameData.sound != 'slow'){
				gameData.sound = 'slow';
				stopSoundLoop('soundSlidingFast');
				playSoundLoop('soundSlidingSlow');
			}
		}
	}
}

function stopSlidingSound(){
	gameData.sound = 'none';
	stopSoundLoop('soundSlidingFast');
	stopSoundLoop('soundSlidingSlow');
}

/*!
 * 
 * UPDATE BACKGROUND - This is the function that runs to update background loop
 * 
 */
function updateBackground(){
	boards.x = (boards.x - (gameData.speed * .2)) % (boards.tileW)-(boardsImg.width);
	tableSide.x = (tableSide.x - gameData.speed) % (tableSide.tileW)-(tableSideImg.width);
	tableTop.x = (tableTop.x - gameData.speed) % (tableTop.tileW)-(tableTopImg.width);
	
	tableTarget.x -= gameData.speed;
	tableEnd.x -= gameData.speed;
	
	for(var c=0;c<gameData.chairs_arr.length;c++){
		gameData.chairs_arr[c].x -= gameData.speed;
	}
	
	updateTableMask();
}

/*!
 * 
 * UPDATE TABLE MASK - This is the function that runs to update table mask
 * 
 */
function updateTableMask(){
	tableMask.graphics.clear();
	tableMask.graphics.beginFill('black').drawRect(0, tableTop.y, tableEnd.x + (tableEnd.image.naturalWidth/2), tableTopImg.height + tableSideImg.height);
}

/*!
 * 
 * PUSH BEER - This is the function that runs to animate beer pushing
 * 
 */
function pushBeer(distance, duration){
	distance = distance / scalePercent;
	
	toggleAnimateArrow(swipeArrow, false);
	playerData.swipe = false;
	swipeArrow.alpha = txtInstruction.alpha = 0;
	
	gameData.speed = (distance * (mugs_arr[gameData.beerNum].weight * .1)).toFixed(3);
	gameData.decreaseSpeed = 0;
	
	var durationSpeed = distance * .005;
	TweenMax.killTweensOf(gameData);
	TweenMax.to(gameData, durationSpeed, {decreaseSpeed:.5, overwrite:true});
	
	gameData.updateBackground = true;
}

/*!
 * 
 * ANIMATE BEER DROP - This is the function that runs to animate beer drop on table
 * 
 */
function animateBeerDrop(con){
	playSound('soundDrop');
	
	beer.oriY = beer.y;
	beer.y -= 100;
	TweenMax.to(beer, .5, {y:beer.oriY, overwrite:true, ease:Bounce.easeOut, onComplete:function(){
		if(con){
			if(gameData.panCamera){
				if(panCameraEndOnce){
					gameData.panCamera = false;	
				}
				animateTableTarget();
			}else{
				setActionReady();	
			}
		}
	}});	
}

/*!
 * 
 * ANIMATE BEER FALL - This is the function that runs to animate beer fall from table
 * 
 */
function animateBeerFall(){
	var tweenSpeed = gameData.speed * .02;
	var rangeNum = gameData.speed * 10;
	
	if(gameData.speed < 15){
		tweenSpeed = 1;
	}
	
	beerShadow.alpha = 0;
	gameData.speed = 0;
	gameData.updateBackground = false;
	
	beer.fallX = beer.x;
	TweenMax.killTweensOf(beer);
	TweenMax.to(beer, tweenSpeed, {bezier:{type:"quadratic", autoRotate:true, values:[{x:beer.x, y:beer.y}, {x:beer.x + rangeNum, y:beer.y}, {x:beer.x + rangeNum, y:canvasH/100 * 120}]}, ease:Linear.easeNone, onComplete:function(){
		playSound('soundBreaking');
		checkGameEnd(false);
	}});
}

/*!
 * 
 * CHECK GAME END - This is the function that runs to check game end
 * 
 */
function checkGameEnd(con){
	stopSlidingSound();
		
	var gameEnd = false;
	var gameNew = con;
	
	if(!gameNew){
		playSound('soundFail');
		if(decreaseChances() == false){
			gameEnd = true;
		}
	}
	
	beerShadow.alpha = 0;
	beer.alpha = 0;
	beer.rotation = 0;
	beer.x = tableTarget.x - (gameData.distance - beerData.startX);
	beer.y = beerData.startY;
	
	gameData.status = 'focus';
	gameData.updateBackground = true;
	beer.oldX = beer.x;
	
	var cameraTweenSpeed = Math.abs(beer.x)/1500;
	TweenMax.to(beer, cameraTweenSpeed, {x:beerData.startX, overwrite:true, onComplete:function(){
		if(gameNew){
			gameData.updateBackground = false;
			resetCharis();
			createGame();
		}else if(gameEnd){
			goPage('result');
		}else{
			setActionReady();
			animateBeerDrop(false);
		}
	}});
}

/*!
 * 
 * UPDATE LEVEL - This is the function that runs to update game level
 * 
 */
function updateLevel(){
	gameData.distanceStart += level_arr.distanceIncrease;
	gameData.targetRange -= level_arr.targetRangeDecrease;	
}

/*!
 * 
 * UPDATE STAT - This is the function that runs to update game stats
 * 
 */
function updateStat(){
	txtChances.text = textChances.replace('[NUMBER]', playerData.chances);
	txtScores.text = textScores.replace('[NUMBER]', Math.floor(playerData.score));
	txtDistance.text = textDistance.replace('[NUMBER]', Math.floor(playerData.distance));
}

function updateScore(){
	stopSlidingSound();
	playSound('soundScore');
	gameData.updateBackground = false;
	
	var scoreRange = beer.x - tableTarget.x;
	var newScore = playerData.score + Math.floor(scoreRange/(level_arr.targetRange - (beer.image.naturalWidth/2)) * 100);
	updateStat();
	TweenMax.to(playerData, 1, {score:newScore, overwrite:true, onUpdate:function(){
		updateStat();
	}, onComplete:function(){
		updateLevel();
		checkGameEnd(true);
	}});
}

function updateDistance(){
	TweenMax.to(playerData, .5, {distance:gameData.distanceStart, overwrite:true, onUpdate:function(){
		updateStat();
	}});
}

function decreaseChances(){
	playerData.chances--;
	updateStat();
	
	if(playerData.chances <= 0){
		return false;	
	}else{
		return true;	
	}
}

/*!
 * 
 * CONFIRM - This is the function that runs to toggle confirm
 * 
 */
function togglePop(con){
	exitContainer.visible = con;
}

/*!
 * 
 * OPTIONS - This is the function that runs to toggle options
 * 
 */

function toggleOptions(con){
	if(optionsContainer.visible){
		optionsContainer.visible = false;
	}else{
		optionsContainer.visible = true;
	}
	if(con!=undefined){
		optionsContainer.visible = con;
	}
}

/*!
 * 
 * OPTIONS - This is the function that runs to mute and fullscreen
 * 
 */
function toggleSoundMute(con){
	buttonSoundOff.visible = false;
	buttonSoundOn.visible = false;
	toggleSoundInMute(con);
	if(con){
		buttonSoundOn.visible = true;
	}else{
		buttonSoundOff.visible = true;	
	}
}

function toggleMusicMute(con){
	buttonMusicOff.visible = false;
	buttonMusicOn.visible = false;
	toggleMusicInMute(con);
	if(con){
		buttonMusicOn.visible = true;
	}else{
		buttonMusicOff.visible = true;	
	}
}

function toggleFullScreen() {
  if (!document.fullscreenElement &&    // alternative standard method
      !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}

/*!
 * 
 * SHARE - This is the function that runs to open share url
 * 
 */
function shareLinks(action, shareScore){
	if(shareSettings.gtag){
		gtag('event','click',{'event_category':'share','event_label':action});
	}

	var gameURL = location.href;
	gameURL = encodeURIComponent(gameURL.substring(0,gameURL.lastIndexOf("/") + 1));

	var shareTitle = shareSettings.shareTitle.replace("[SCORE]", shareScore);
	var shareText = shareSettings.shareText.replace("[SCORE]", shareScore);

	var shareURL = '';
	if( action == 'facebook' ){
		if(shareSettings.customScore){
			gameURL = decodeURIComponent(gameURL);
			shareURL = `https://www.facebook.com/sharer/sharer.php?u=`+encodeURIComponent(`${gameURL}share.php?title=${shareTitle}&url=${gameURL}&thumb=${gameURL}share.jpg`);
		}else{
			shareURL = `https://www.facebook.com/sharer/sharer.php?u=${gameURL}`;
		}
	}else if( action == 'twitter' ){
		shareURL = `https://twitter.com/intent/tweet?text=${shareText}&url=${gameURL}`;
	}else if( action == 'whatsapp' ){
		shareURL = `https://api.whatsapp.com/send?text=${shareText}%20${gameURL}`;
	}else if( action == 'telegram' ){
		shareURL = `https://t.me/share/url?url=${gameURL}&text=${shareText}`;
	}else if( action == 'reddit' ){
		shareURL = `https://www.reddit.com/submit?url=${gameURL}&title=${shareText}`;
	}else if( action == 'linkedin' ){
		shareURL = `https://www.linkedin.com/sharing/share-offsite/?url=${gameURL}`;
	}

	window.open(shareURL);
}