window.addEventListener("load", drawScreen, false);

var imgBackgournd = new Image();
imgBackgournd.src = "img/background.png";
imgBackgournd.addEventListener("load", drawScreen, false);

var imgPlayer = new Image();
imgPlayer.src = "img/player.png";
imgPlayer.addEventListener("load", drawScreen, false);

function drawScreen() {
    var theCanvas = document.getElementById("GameCanvas");
    var Context = theCanvas.getContext("2d");

    Context.fillStyle = "#000000";
    Context.fillRect(0, 0, 800, 600);

    //배경 화면 그리기
    Context.drawImage(imgBackgournd, 0, 0);

    //플레이어 그리기
    Context.drawImage(imgPlayer, 350, 250);
}