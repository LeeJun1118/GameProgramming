(function (window) {
    var bestScore = 0;//최고 점수

    window.addEventListener("logo", drawScreen,false);
    window.addEventListener("keydown", onkeydown, true);

    var imgBackground = new Image();
    imgBackground.src = "img/background.png";
    imgBackground.addEventListener("load", drawScreen, false);

    function drawScreen() {
        var theCanvas = document.getElementById("game");
        var Context = theCanvas.getContext("2d");

        Context.fillStyle = "#000000";
        //Context.fillRect(0, 0, 1000, 750);

        //배경 화면 그리기
        Context.drawImage(imgBackground, 0, 0);
        Context.fillStyle = "#ffffff";
        Context.font = '50px Arial';
        Context.fillText("Color Blast", 380, 300);

        Context.font = '20px Arial';
        Context.fillText("마우스 클릭시 게임 시작",370, 600);
    }
    var Game = {


        init: function () {
            this.screen();
            this.bullets = [];
            this.enemyBullets = [];
            this.enemies = [];
            this.particles = [];
            this.bulletIndex = 0;
            this.enemyBulletIndex = 0;
            this.enemyIndex = 0;
            this.particleIndex = 0;
            this.maxParticles = 10;
            this.maxEnemies = 15;
            this.enemiesAlive = 0;
            this.currentFrame = 0;
            this.maxLives = 0;
            this.life = 0;
            this.binding();
            this.player = new Player();
            this.score = 0;
            this.paused = false;
            this.shooting = false;
            this.oneShot = false;
            this.isGameOver = false;
            this.requestAnimationFrame = window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;
            for (var i = 0; i < this.maxEnemies; i++) {
                new Enemy();
                this.enemiesAlive++;
            }
            this.invincibleMode(500);

        },


        screen: function () {
            this.c = document.getElementById("game");

            this.c.width = this.c.width;
            this.c.height = this.c.height;
            this.ctx = this.c.getContext("2d");
            this.color = "rgba(20,20,20,.7)"; //
            //fthis.ctx.drawImage(imgBackground, 0, 0);
        },


        binding: function () {
            window.addEventListener("keydown", this.buttonDown);
            window.addEventListener("keyup", this.buttonUp);
            window.addEventListener("keypress", this.keyPressed);
            this.c.addEventListener("click", this.clicked);
        },

        clicked: function () {
            if (!Game.paused) {
                Game.pause();
            } else {
                if (Game.isGameOver) {
                    Game.init();
                } else {
                    Game.unPause();
                    Game.loop();
                    Game.invincibleMode(1000);
                }
            }
        },

        keyPressed: function (e) {
            if (e.keyCode === 32) {
                if (!Game.player.invincible && !Game.oneShot) {
                    Game.player.shoot();
                    Game.oneShot = true;
                }
                if (Game.isGameOver) {
                    Game.init();
                }
                e.preventDefault();
            }
        },

        buttonUp: function (e) {
            if (e.keyCode === 32) {
                Game.shooting = false;
                Game.oneShot = false;
                e.preventDefault();
            }
            if (e.keyCode === 37 || e.keyCode === 65) {
                Game.player.movingLeft = false;
            }
            if (e.keyCode === 39 || e.keyCode === 68) {
                Game.player.movingRight = false;
            }
        },

        buttonDown: function (e) {
            if (e.keyCode === 32) {
                Game.shooting = true;
            }
            if (e.keyCode === 37 || e.keyCode === 65) {
                Game.player.movingLeft = true;
            }
            if (e.keyCode === 39 || e.keyCode === 68) {
                Game.player.movingRight = true;
            }
        },

        //랜덤 함수
        random: function (min, max) {
            return Math.floor(Math.random() * (max - min) + min);
        },

        //무적 모드 (깜빡 거림)
        invincibleMode: function (s) {
            this.player.invincible = true;
            setTimeout(function () {
                Game.player.invincible = false;
            }, s);
        },

        //충돌 기능
        collision: function (a, b) {
            return !(
                ((a.y + a.height) < (b.y)) ||
                (a.y > (b.y + b.height)) ||
                ((a.x + a.width) < b.x) ||
                (a.x > (b.x + b.width))
            )
        },
// 초기화
        clear: function () {
            this.ctx.fillStyle = Game.color;
            this.ctx.fillRect(0, 0, this.c.width, this.c.height);
        },
        //일시 정지 시작
        pause: function () {
            this.paused = true;
        },
        //일시 정지 해제
        unPause: function () {
            this.paused = false;
        },

//game Over
        gameOver: function () {
            if (bestScore < this.score)
                bestScore = this.score;
            this.isGameOver = true;
            this.clear();
            var overMessage = "Game Over";
            var scoreMessage = "Score: " + Game.score;
            var noticeMessage = "Click or press Spacebar to Play Again";
            this.pause();
            this.ctx.fillStyle = "white";
            this.ctx.font = "bold 30px Lato, sans-serif";
            this.ctx.fillText(overMessage, this.c.width / 2 - this.ctx.measureText(overMessage).width / 2, this.c.height / 2 - 50);
            this.ctx.fillText(scoreMessage, this.c.width / 2 - this.ctx.measureText(scoreMessage).width / 2, this.c.height / 2 - 5);
            this.ctx.font = "bold 16px Lato, sans-serif";
            this.ctx.fillText(noticeMessage, this.c.width / 2 - this.ctx.measureText(noticeMessage).width / 2, this.c.height / 2 + 30);
        },

        updateScore: function () {
            this.ctx.fillStyle = "white";
            this.ctx.font = "16px Lato, sans-serif";
            this.ctx.fillText("Score: " + this.score, 8, 20);
            this.ctx.fillText("Lives: " + (this.maxLives - this.life), 8, 40);
            this.ctx.fillText("Best Score: " + bestScore, 8, 60);
        },

        //게임 중
        loop: function () {
            //일시정지가 아니라면
            if (!Game.paused) {
                Game.clear(); //배경 그리기
                for (var i in Game.enemies) {
                    var currentEnemy = Game.enemies[i]; //만들어서 배열에 넣어 둔 적 값을 하나씩 넣음
                    currentEnemy.draw();
                    currentEnemy.update();

                    // 게임 프레임%적발사속도(30~80)
                    if (Game.currentFrame % currentEnemy.shootingSpeed === 0) {
                        //적 총알 발사
                        currentEnemy.shoot();
                    }
                }
                //적 총알 만들기
                for (var x in Game.enemyBullets) {
                    Game.enemyBullets[x].draw();
                    Game.enemyBullets[x].update();
                }
                //Player총알 만들기
                for (var z in Game.bullets) {
                    Game.bullets[z].draw();
                    Game.bullets[z].update();
                }
                //Player 무적 상태 깜빡이는 정도
                if (Game.player.invincible) {
                    if (Game.currentFrame % 5 === 0) {
                        Game.player.draw();
                    }
                } else {
                    Game.player.draw();
                }
                // 터지는 이펙트
                for (var i in Game.particles) {
                    Game.particles[i].draw();
                }
                Game.player.update();
                Game.updateScore();
                Game.currentFrame = Game.requestAnimationFrame.call(window, Game.loop);
            }
        }

    };


    var Player = function () {
        this.width = 60;
        this.height = 20;
        this.x = Game.c.width / 2 - this.width / 2;
        this.y = Game.c.height - this.height;
        this.movingLeft = false;
        this.movingRight = false;
        this.speed = 8;
        this.invincible = false;
        this.color = "white";
    };


    Player.prototype.die = function () {
        if (Game.life < Game.maxLives) {
            Game.invincibleMode(2000);
            Game.life++;
        } else {
            Game.pause();
            Game.gameOver();
        }
    };


    Player.prototype.draw = function () {
        Game.ctx.fillStyle = this.color;
        Game.ctx.fillRect(this.x, this.y, this.width, this.height);
    };


    Player.prototype.update = function () {
        if (this.movingLeft && this.x > 0) {
            this.x -= this.speed;
        }
        if (this.movingRight && this.x + this.width < Game.c.width) {
            this.x += this.speed;
        }
        if (Game.shooting && Game.currentFrame % 10 === 0) {
            this.shoot();
        }
        for (var i in Game.enemyBullets) {
            var currentBullet = Game.enemyBullets[i];
            if (Game.collision(currentBullet, this) && !Game.player.invincible) {
                this.die();
                delete Game.enemyBullets[i];
            }
        }
    };


    Player.prototype.shoot = function () {
        Game.bullets[Game.bulletIndex] = new Bullet(this.x + this.width / 2);
        Game.bulletIndex++;
    };


    var Bullet = function (x) {
        this.width = 8;
        this.height = 20;
        this.x = x;
        this.y = Game.c.height - 10;
        this.vy = 8;
        this.index = Game.bulletIndex;
        this.active = true;
        this.color = "white";

    };


    Bullet.prototype.draw = function () {
        Game.ctx.fillStyle = this.color;
        Game.ctx.fillRect(this.x, this.y, this.width, this.height);
    };


    Bullet.prototype.update = function () {
        this.y -= this.vy;
        if (this.y < 0) {
            delete Game.bullets[this.index];
        }
    };


    var Enemy = function () {
        this.width = 60;
        this.height = 20;
        this.x = Game.random(0, (Game.c.width - this.width));
        this.y = Game.random(10, 40);
        this.vy = Game.random(1, 10) * .1;
        this.index = Game.enemyIndex;
        Game.enemies[Game.enemyIndex] = this;
        Game.enemyIndex++;
        this.speed = Game.random(2, 5);
        this.shootingSpeed = Game.random(30, 80);
        this.movingLeft = Math.random() < 0.5 ? true : false;
        this.color = "hsl(" + Game.random(0, 360) + ", 60%, 50%)";

    };


    Enemy.prototype.draw = function () {
        Game.ctx.fillStyle = this.color;
        Game.ctx.fillRect(this.x, this.y, this.width, this.height);
    };


    Enemy.prototype.update = function () {
        if (this.movingLeft) {
            if (this.x > 0) {
                this.x -= this.speed;
                this.y += this.vy;
            } else {
                this.movingLeft = false;
            }
        } else {
            if (this.x + this.width < Game.c.width) {
                this.x += this.speed;
                this.y += this.vy;
            } else {
                this.movingLeft = true;
            }
        }

        if(this.y >= Game.c.height){
            this.die();
        }

        for (var i in Game.bullets) {
            var currentBullet = Game.bullets[i];
            if (Game.collision(currentBullet, this)) {
                this.die();
                delete Game.bullets[i];
            }

        }
    };

    Enemy.prototype.die = function () {
        this.explode();
        delete Game.enemies[this.index];
        Game.score += 15;
        Game.enemiesAlive = Game.enemiesAlive > 1 ? Game.enemiesAlive - 1 : 0;
        if (Game.enemiesAlive < Game.maxEnemies) {
            Game.enemiesAlive++;
            setTimeout(function () {
                new Enemy();
            }, 2000);
        }

    };

    Enemy.prototype.explode = function () {
        for (var i = 0; i < Game.maxParticles; i++) {
            new Particle(this.x + this.width / 2, this.y, this.color);
        }
    };

    Enemy.prototype.shoot = function () {
        new EnemyBullet(this.x + this.width / 2, this.y, this.color);
    };

    var EnemyBullet = function (x, y, color) {
        this.width = 8;
        this.height = 20;
        this.x = x;
        this.y = y;
        this.vy = 6;
        this.color = color;
        this.index = Game.enemyBulletIndex;
        Game.enemyBullets[Game.enemyBulletIndex] = this;
        Game.enemyBulletIndex++;
    };

    EnemyBullet.prototype.draw = function () {
        Game.ctx.fillStyle = this.color;
        Game.ctx.fillRect(this.x, this.y, this.width, this.height);
    };

    EnemyBullet.prototype.update = function () {
        this.y += this.vy;

        if (this.y > Game.c.height) {
            delete Game.enemyBullets[this.index];
        }
    };


    var Particle = function (x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = Game.random(-5, 5);
        this.vy = Game.random(-5, 5);
        this.color = color || "orange";
        Game.particles[Game.particleIndex] = this;
        this.id = Game.particleIndex;
        Game.particleIndex++;
        this.life = 0;
        this.gravity = .05;
        this.size = 40;
        this.maxlife = 100;
    };

    Particle.prototype.draw = function () {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.size *= .89;
        Game.ctx.fillStyle = this.color;
        Game.ctx.fillRect(this.x, this.y, this.size, this.size);
        this.life++;
        if (this.life >= this.maxlife) {
            delete Game.particles[this.id];
        }
    };

    Game.init();
}(window));