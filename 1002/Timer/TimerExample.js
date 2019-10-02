window.addEventListener("load", drawScreen,false);
window.addEventListener("keydown",drawScreen,false);

var TimerID = setInterval(onLevelUp,5000);

var intLevel = 1;
var bShowLevelUpMessage = false;

var imgChar = new Image();
imgChar.src = "character.png";
imgChar.addEventListener("load",drawScreen,false);

function drawScreen() {
    var theCanvas = document.getElementById("GameCanvas");
    var Context = theCanvas.getContext("2d");

    Context.fillStyle = "#000000";
    Context.fillRect(0,0,320,480);

    Context.drawImage(imgChar,100,180);

    Context.fillStyle = "#ffffff";
    Context.font = '25px Arial';
    Context.textBaseline = "top";
    Context.fillText("Lv  :" + intLevel, 130,300);

    if (bShowLevelUpMessage)
    {
        Context.fillText("Level Up !!!",100,150);
    }
}

function onLevelUp() {
    intLevel++;

    bShowLevelUpMessage = true;
    setTimeout(closeLevelUpMessage,3000);
    if (intLevel >= 5){
        //레벨이 5이상이면 더는 호출되지 않게 한다.
        clearInterval(TimerID);
    }
    drawScreen();
}
function closeLevelUpMessage() {
    bShowLevelUpMessage = false;
    drawScreen();
}