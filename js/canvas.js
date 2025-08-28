////////////////////////////////////////////////////////////
// CANVAS
////////////////////////////////////////////////////////////
var stage;
var canvasW=0;
var canvasH=0;

/*!
 * 
 * START GAME CANVAS - This is the function that runs to setup game canvas
 * 
 */
function initGameCanvas(w,h){
	canvasW=w;
	canvasH=h;
	stage = new createjs.Stage("gameCanvas",{ antialias: true });
	
	createjs.Touch.enable(stage);
	stage.enableMouseOver(20);
	stage.mouseMoveOutside = true;
	
	createjs.Ticker.framerate = 60;
	createjs.Ticker.addEventListener("tick", tick);	
}

var safeZoneGuide = false;
var canvasContainer, mainContainer, gameContainer, resultContainer, exitContainer, optionsContainer, shareContainer, shareSaveContainer, socialContainer;
var guideline, bg, bgP, logo, logoP;
var itemExit, itemExitP, popTitleTxt, popDescTxt, buttonConfirm, buttonCancel;
var itemResult, itemResultP, buttonContinue, resultTitleTxt, resultDescTxt, buttonShare, buttonSave;
var resultTitleOutlineTxt,resultDescOutlineTxt,resultShareTxt,resultShareOutlineTxt,popTitleOutlineTxt,popDescOutlineTxt;
var buttonSettings, buttonFullscreen, buttonSoundOn, buttonSoundOff, buttonMusicOn, buttonMusicOff, buttonExit;
$.share = {};

var tableContainer;
var background, buttonStartTxt, beer, beerShadow, chair, tableSide, tableTop, tableEnd, tableTarget, tableMask, tableTopImg, tableSideImg, boards, boardsImg, iconBeer, txtChances, txtScores, txtDistance, distanceBg, txtInstruction, txtResultTitle, txtResultScore, buttonReplay, swipeArrow;
var confirmMessageTxt;
$.beers = {};

/*!
 * 
 * BUILD GAME CANVAS ASSERTS - This is the function that runs to build game canvas asserts
 * 
 */
function buildGameCanvas(){
	canvasContainer = new createjs.Container();
    mainContainer = new createjs.Container();
    gameContainer = new createjs.Container();
    exitContainer = new createjs.Container();
    resultContainer = new createjs.Container();
    shareContainer = new createjs.Container();
    shareSaveContainer = new createjs.Container();
    socialContainer = new createjs.Container();
	
	tableContainer = new createjs.Container();
	
	background = new createjs.Bitmap(loader.getResult('background'));
	logo = new createjs.Bitmap(loader.getResult('logo'));
	
	buttonStartTxt = new createjs.Text();
	buttonStartTxt.font = "50px neutonregular";
	buttonStartTxt.color = "#ffffff";
	buttonStartTxt.text = startButtonText;
	buttonStartTxt.textAlign = "center";
	buttonStartTxt.textBaseline='alphabetic';
	buttonStartTxt.x = canvasW/2;
	buttonStartTxt.y = canvasH/100 * 70;
	
	chair = new createjs.Bitmap(loader.getResult('chair'));
	centerReg(chair);
	chair.x -= chair.image.naturalWidth;
	
	boardsImg = loader.getResult("boards");
	boards = new createjs.Shape();
	boards.graphics.beginBitmapFill(boardsImg).drawRect(0, 0, canvasW + (boardsImg.width*2), boardsImg.height);
	boards.tileW = boardsImg.width;
	boards.y = canvasH/100 * 20;
	
	tableSideImg = loader.getResult("tableSide");
	tableSide = new createjs.Shape();
	tableSide.graphics.beginBitmapFill(tableSideImg).drawRect(0, 0, canvasW + (tableSideImg.width*2), tableSideImg.height);
	tableSide.tileW = tableSideImg.width;
	tableSide.y = canvasH - tableSideImg.naturalHeight;
	
	tableTopImg = loader.getResult("tableTop");
	tableTop = new createjs.Shape();
	tableTop.graphics.beginBitmapFill(tableTopImg).drawRect(0, 0, canvasW + (tableTopImg.width*2), tableTopImg.height);
	tableTop.tileW = tableTopImg.width;
	tableTop.y = canvasH - (tableSideImg.naturalHeight+tableTopImg.naturalHeight);
	
	tableEnd = new createjs.Bitmap(loader.getResult('tableEnd'));
	tableEnd.regX = tableEnd.image.naturalWidth/2;
	tableEnd.y = tableTop.y;
	tableEnd.x = canvasW;
	
	tableTarget = new createjs.Bitmap(loader.getResult('tableTarget'));
	centerReg(tableTarget);
	tableTarget.y = tableTop.y + (tableTarget.image.naturalHeight/2);
	
	tableMask = new createjs.Shape();
	tableMask.alpha = 0;
	tableSide.mask = tableMask;
	tableTop.mask = tableMask;
	
	beerShadow = new createjs.Shape();
	
	txtDistance = new createjs.Text();
	txtDistance.font = "50px neutonregular";
	txtDistance.color = "#fff";
	txtDistance.text = '';
	txtDistance.textAlign = "center";
	txtDistance.textBaseline='alphabetic';
	txtDistance.x = canvasW/100 * 120;
	
	distanceBg = new createjs.Bitmap(loader.getResult('distanceBg'));
	centerReg(distanceBg);
	distanceBg.regX = distanceBg.image.naturalWidth;
	
	tableContainer.addChild(boards, chair, tableSide, tableTop, tableEnd, tableTarget, distanceBg, txtDistance, tableMask, beerShadow);
	
	for(var n=0;n<mugs_arr.length;n++){
		$.beers[n] = new createjs.Bitmap(loader.getResult('beer'+n));
		centerReg($.beers[n]);
		$.beers[n].regY = $.beers[n].image.naturalHeight;
		tableContainer.addChild($.beers[n]);
		
		gameData.beerArray.push(n);
	}
	shuffle(gameData.beerArray);
	
	iconBeer = new createjs.Bitmap(loader.getResult('iconBeer'));
	centerReg(iconBeer);
	iconBeer.x = canvasW/100 * 7;
	iconBeer.y = canvasH/100 * 10;
	
	swipeArrow = new createjs.Bitmap(loader.getResult('swipeArrow'));
	centerReg(swipeArrow);
	swipeArrow.x = canvasW/100 * 38;
	swipeArrow.y = canvasH/100 * 46;
	
	txtChances = new createjs.Text();
	txtChances.font = "80px neutonregular";
	txtChances.color = "#536654";
	txtChances.text = '';
	txtChances.textAlign = "left";
	txtChances.textBaseline='alphabetic';
	txtChances.x = canvasW/100 * 13;
	txtChances.y = canvasH/100 * 15;
	
	txtScores = new createjs.Text();
	txtScores.font = "80px neutonregular";
	txtScores.color = "#536654";
	txtScores.text = '';
	txtScores.textAlign = "center";
	txtScores.textBaseline='alphabetic';
	txtScores.x = canvasW/2;
	txtScores.y = canvasH/100 * 15;
	
	txtInstruction = new createjs.Text();
	txtInstruction.font = "50px neutonregular";
	txtInstruction.color = "#ffffff";
	txtInstruction.text = instructionText;
	txtInstruction.textAlign = "center";
	txtInstruction.textBaseline='alphabetic';
	txtInstruction.x = canvasW/2;
	txtInstruction.y = canvasH/100 * 70;
	
	socialContainer.visible = false;
    socialContainer.scale = 1;
    shareContainer.addChild(socialContainer);

    if(shareSettings.enable){
        buttonShare = new createjs.Bitmap(loader.getResult('buttonShare'));
        centerReg(buttonShare);
        
        var pos = {x:0, y:45, spaceX:65};
        pos.x = -(((shareSettings.options.length-1) * pos.spaceX)/2)
        for(let n=0; n<shareSettings.options.length; n++){
            var shareOption = shareSettings.options[n];
            var shareAsset = String(shareOption[0]).toUpperCase() + String(shareOption).slice(1);
            $.share['button'+n] = new createjs.Bitmap(loader.getResult('button'+shareAsset));
            $.share['button'+n].shareOption = shareOption;
            centerReg($.share['button'+n]);
            $.share['button'+n].x = pos.x;
            $.share['button'+n].y = pos.y;
            socialContainer.addChild($.share['button'+n]);
            pos.x += pos.spaceX;
        }
        buttonShare.y = (buttonShare.image.naturalHeight/2) + 10;
        shareContainer.addChild(buttonShare);
    }

    if ( typeof toggleScoreboardSave == 'function' ) { 
        buttonSave = new createjs.Bitmap(loader.getResult('buttonSave'));
        centerReg(buttonSave);
        buttonSave.y = (buttonSave.image.naturalHeight/2) + 10;
        shareSaveContainer.addChild(buttonSave);
    }

	shareContainer.x = shareSaveContainer.x = canvasW/2;
	shareContainer.y = shareSaveContainer.y = canvasH/100 * 30;
	
	txtResultTitle = new createjs.Text();
	txtResultTitle.font = "90px neutonregular";
	txtResultTitle.color = "#495749";
	txtResultTitle.text = textResultTitle;
	txtResultTitle.textAlign = "center";
	txtResultTitle.textBaseline='alphabetic';
	txtResultTitle.x = canvasW/2;
	txtResultTitle.y = canvasH/100 * 18;
	
	txtResultScore = new createjs.Text();
	txtResultScore.font = "70px neutonregular";
	txtResultScore.color = "#495749";
	txtResultScore.text = '100pts';
	txtResultScore.textAlign = "center";
	txtResultScore.textBaseline='alphabetic';
	txtResultScore.x = canvasW/2;
	txtResultScore.y = canvasH/100 * 26;
	
	buttonReplay = new createjs.Text();
	buttonReplay.font = "50px neutonregular";
	buttonReplay.color = "#ffffff";
	buttonReplay.text = replayButtonText;
	buttonReplay.textAlign = "center";
	buttonReplay.textBaseline='alphabetic';
	buttonReplay.x = canvasW/2;
	buttonReplay.y = canvasH/100 * 70;
	buttonReplay.hitArea = new createjs.Shape(new createjs.Graphics().beginFill("#000").drawRect(-200, -30, 400, 40));
	
	exitContainer = new createjs.Container();
	optionsContainer = new createjs.Container();
	
	//option
	buttonFullscreen = new createjs.Bitmap(loader.getResult('buttonFullscreen'));
	centerReg(buttonFullscreen);
	buttonSoundOn = new createjs.Bitmap(loader.getResult('buttonSoundOn'));
	centerReg(buttonSoundOn);
	buttonSoundOff = new createjs.Bitmap(loader.getResult('buttonSoundOff'));
	centerReg(buttonSoundOff);
	buttonSoundOn.visible = false;
	buttonMusicOn = new createjs.Bitmap(loader.getResult('buttonMusicOn'));
	centerReg(buttonMusicOn);
	buttonMusicOff = new createjs.Bitmap(loader.getResult('buttonMusicOff'));
	centerReg(buttonMusicOff);
	buttonMusicOn.visible = false;
	
	buttonExit = new createjs.Bitmap(loader.getResult('buttonExit'));
	centerReg(buttonExit);
	buttonSettings = new createjs.Bitmap(loader.getResult('buttonSettings'));
	centerReg(buttonSettings);
	
	createHitarea(buttonFullscreen);
	createHitarea(buttonSoundOn);
	createHitarea(buttonSoundOff);
	createHitarea(buttonMusicOn);
	createHitarea(buttonMusicOff);
	createHitarea(buttonExit);
	createHitarea(buttonSettings);
	optionsContainer = new createjs.Container();
	optionsContainer.addChild(buttonFullscreen, buttonSoundOn, buttonSoundOff, buttonMusicOn, buttonMusicOff, buttonExit);
	optionsContainer.visible = false;
	
	//exit
	itemExit = new createjs.Bitmap(loader.getResult('itemExit'));
	centerReg(itemExit);
	itemExit.x = canvasW/2;
	itemExit.y = canvasH/2;
	
	buttonConfirm = new createjs.Bitmap(loader.getResult('buttonConfirm'));
	centerReg(buttonConfirm);
	createHitarea(buttonConfirm)
	buttonConfirm.x = canvasW/100* 35;
	buttonConfirm.y = canvasH/100 * 63;
	
	buttonCancel = new createjs.Bitmap(loader.getResult('buttonCancel'));
	centerReg(buttonCancel);
	createHitarea(buttonCancel)
	buttonCancel.x = canvasW/100 * 65;
	buttonCancel.y = canvasH/100 * 63;
	
	confirmMessageTxt = new createjs.Text();
	confirmMessageTxt.font = "50px riffic_free_mediumbold";
	confirmMessageTxt.lineHeight = 65;
	confirmMessageTxt.color = "#495749";
	confirmMessageTxt.textAlign = "center";
	confirmMessageTxt.textBaseline='alphabetic';
	confirmMessageTxt.text = exitMessage;
	confirmMessageTxt.x = canvasW/2;
	confirmMessageTxt.y = canvasH/100 *40;
	
	exitContainer.addChild(itemExit, buttonConfirm, buttonCancel, confirmMessageTxt);
	exitContainer.visible = false;

	guideline = new createjs.Shape();
	
	mainContainer.addChild(logo, buttonStartTxt);
	mainContainer.hitArea = new createjs.Shape(new createjs.Graphics().beginFill("#000").drawRect(0, 0, canvasW, canvasH));
	gameContainer.addChild(iconBeer, txtChances, txtScores, swipeArrow, txtInstruction);
	resultContainer.addChild( txtResultTitle, txtResultScore, buttonReplay, shareContainer, shareSaveContainer);

	canvasContainer.addChild(background, tableContainer, mainContainer, gameContainer, resultContainer, exitContainer, optionsContainer, buttonSettings);
	stage.addChild(canvasContainer);
	
	resizeCanvas();
}


/*!
 * 
 * RESIZE GAME CANVAS - This is the function that runs to resize game canvas
 * 
 */
function resizeCanvas(){
	const cssWidth = stageW * scalePercent;
	const cssHeight = stageH * scalePercent;
	const gameCanvas = document.getElementById("gameCanvas");
	gameCanvas.style.width = cssWidth + "px";
	gameCanvas.style.height = cssHeight + "px";

	gameCanvas.style.left = (offset.left/2) + "px";
	gameCanvas.style.top = (offset.top/2) + "px";
	
	gameCanvas.width = stageW * dpr;
	gameCanvas.height = stageH * dpr;
	
 	if(canvasContainer!=undefined){
		stage.scaleX = stage.scaleY = dpr;
		
		if(safeZoneGuide){	
			guideline.graphics.clear().setStrokeStyle(2).beginStroke('red').drawRect((stageW-contentW)/2, (stageH-contentH)/2, contentW, contentH);
		}

		buttonSettings.x = (canvasW - offset.x) - 60;
		buttonSettings.y = offset.y + 45;
		
		var distanceNum = 75;
		var nextCount = 0;
		buttonSoundOn.x = buttonSoundOff.x = buttonSettings.x;
		buttonSoundOn.y = buttonSoundOff.y = buttonSettings.y+distanceNum;
		buttonSoundOn.x = buttonSoundOff.x;
		buttonSoundOn.y = buttonSoundOff.y = buttonSettings.y+distanceNum;
		if (typeof buttonMusicOn != "undefined") {
			buttonMusicOn.x = buttonMusicOff.x = buttonSettings.x;
			buttonMusicOn.y = buttonMusicOff.y = buttonSettings.y+(distanceNum*2);
			buttonMusicOn.x = buttonMusicOff.x;
			buttonMusicOn.y = buttonMusicOff.y = buttonSettings.y+(distanceNum*2);
			nextCount = 2;
		}else{
			nextCount = 1;
		}
		buttonFullscreen.x = buttonSettings.x;
		buttonFullscreen.y = buttonSettings.y+(distanceNum*(nextCount+1));

		if(curPage == 'main' || curPage == 'result'){
			buttonExit.visible = false;			
			buttonFullscreen.x = buttonSettings.x;
			buttonFullscreen.y = buttonSettings.y+(distanceNum*(nextCount+1));
		}else{
			buttonExit.visible = true;			
			buttonExit.x = buttonSettings.x;
			buttonExit.y = buttonSettings.y+(distanceNum*(nextCount+2));
		}
	}
}

function centerContainer(obj){
	obj.x = (windowW/2) - ((canvasW * scalePercent)/2);
	obj.y = (windowH/2) - ((canvasH * scalePercent)/2);
}

function resizeCanvasItem(){
	centerContainer(canvasContainer);
}

/*!
 * 
 * REMOVE GAME CANVAS - This is the function that runs to remove game canvas
 * 
 */
 function removeGameCanvas(){
	 stage.autoClear = true;
	 stage.removeAllChildren();
	 stage.update();
	 createjs.Ticker.removeEventListener("tick", tick);
	 createjs.Ticker.removeEventListener("tick", stage);
 }

/*!
 * 
 * CANVAS LOOP - This is the function that runs for canvas loop
 * 
 */ 
function tick(event) {
	updateGame(event);
	stage.update(event);
}

/*!
 * 
 * CANVAS MISC FUNCTIONS
 * 
 */
function centerReg(obj){
	obj.regX=obj.image.naturalWidth/2;
	obj.regY=obj.image.naturalHeight/2;
}

function createHitarea(obj){
	obj.hitArea = new createjs.Shape(new createjs.Graphics().beginFill("#000").drawRect(0, 0, obj.image.naturalWidth, obj.image.naturalHeight));	
}