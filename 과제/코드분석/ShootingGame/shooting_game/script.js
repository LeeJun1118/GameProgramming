//window를 파라미터로 받아오는 함수를 만듬
(function (window) {

    var Game = {

        //초기 설정 함수 init
        init: function () {
            // 자바스크립트에서 this는 자바의 this와는 조금 다르다.
            // 함수 실행에서의 this는 전역 객체이며 웹 브라우저에서 전역 객체는 window이다

            // 전역객체 window에 c라는 속성을 document.getElementById("game")로 추가
            this.c = document.getElementById("game");
            this.c.width = this.c.width;
            this.c.height = this.c.height;
            this.ctx = this.c.getContext("2d");
            this.color = "rgba(20,20,20,.7)"; //배경색 지정 (css) - 검은색

			//배열 생성
            this.bullets = [];
            this.enemyBullets = [];
            this.enemies = [];
            this.particles = [];//터지는 효과를 위한 배열
			//인덱스 변수 생성
            this.bulletIndex = 0;
            this.enemyBulletIndex = 0;
            this.enemyIndex = 0;
            this.particleIndex = 0;//터지는 효과를 위한 인덱스 변수
            this.maxParticles = 10;
            this.maxEnemies = 6; //최대 적 수
            this.enemiesAlive = 0;
            this.currentFrame = 0;
            this.maxLives = 3;
            this.life = 0;
            this.binding(); // binding 함수
            this.player = new Player(); //플레이어 생성
            this.score = 0;
            this.paused = false;
            this.shooting = false;
            this.oneShot = false;
            this.isGameOver = false;
			//적을 움직이기 위한 애니메이션
            this.requestAnimationFrame = window.requestAnimationFrame||window.webkitRequestAnimationFrame;
            //적 생성 for루프 0 ~ 6
            for (var i = 0; i < this.maxEnemies; i++) {
                new Enemy();
                this.enemiesAlive++; //적 생성후 적 수 1 증가
            }
            this.invincibleMode(2000); //첫 시작시 2초간 무적 모드

            this.loop(); //루프 함수 실행
        },


        binding: function () {
        	// key설정 함수
            window.addEventListener("keydown", this.buttonDown);
            window.addEventListener("keyup", this.buttonUp);
            window.addEventListener("keypress", this.keyPressed);
            this.c.addEventListener("click", this.clicked);
        },

		// 마우스 클릭 했을때 일시 정지/해제
        clicked: function () {
            if (!Game.paused) { //일시 정지가 아니라면 일시정지
                Game.pause();
            } else {
                if (Game.isGameOver) {//게임이 끝났다면
                    Game.init(); // 처음부터 시작
                } else {
                    Game.unPause(); //일시정지 해제
                    Game.loop(); //게임 재시작
                    Game.invincibleMode(1000); //1초 무적
                }
            }
        },

		// spacebar 계속 누르는 상태 함수
        keyPressed: function (e) {
            if (e.keyCode === 32) {
            	// !Game.player.invincible 없어도 실행에 문제 없음
                if (!Game.player.invincible && !Game.oneShot) {
                    Game.player.shoot(); //총알 발사
                    Game.oneShot = true; //한번 발사하는 상태를 true로 바꾼다
                }
                if (Game.isGameOver) {
                    Game.init(); //gameover일때 spacebar를 누르면 초기 화면으로 돌아간다.
                }
                //웹 브라우저의 기본 동작을 막는다.(없어도 문제 발견 X)
                e.preventDefault();
            }
        },

		// 버튼을 누르다가 땠을 때
        buttonUp: function (e) {
        	// spacebar
            if (e.keyCode === 32) {
                Game.shooting = false;
                //Game.oneShot = false;
                e.preventDefault();
            }
            //   <-  or  A  를 false
            if (e.keyCode === 37 || e.keyCode === 65) {
                Game.player.movingLeft = false;
            }
            //  ->   or  D  를 false
            if (e.keyCode === 39 || e.keyCode === 68) {
                Game.player.movingRight = false;
            }
        },

		// 버튼을 눌렀을 떄
        buttonDown: function (e) {
			// spacebar
            if (e.keyCode === 32) {
                Game.shooting = true;
            }
            //   <-  or  A
            if (e.keyCode === 37 || e.keyCode === 65) {
                Game.player.movingLeft = true;
            }
            //   ->  or  D
            if (e.keyCode === 39 || e.keyCode === 68) {
                Game.player.movingRight = true;
            }
        },

		// 랜덤 함수 생성 min,max를 인수로 받아서 계산
        random: function (min, max) {
        	// Math.random 함수는 0 ~ 1까지의 실수를 반환함으로 정수로 나타내기 위해 곱하기를 한후 Math.floor로 정수화 해야한다.
            return Math.floor(Math.random() * (max - min) + min);
        },

		// 무적 모드 함수
        invincibleMode: function (s) {
        	// 무적으로 만들고
            this.player.invincible = true;
            // s 시간뒤에 함수를 실행 시킨다.
            setTimeout(function () {
                Game.player.invincible = false;
            }, s);
        },

		// 충돌 함수
        collision: function (a, b) {
            return !(
                ((a.y + a.height) < (b.y)) ||  // a의 y좌표 + 높이가 < b의 y좌표 보다 작거나
                (a.y > (b.y + b.height)) || 	//a의 y 좌표가 > b의 y좌표 + b의 높이 보다 크거나
                ((a.x + a.width) < b.x) ||		//a의 x좌표 + a의 폭이 < b의 x 좌표보다 작거나
                (a.x > (b.x + b.width))			//a의 x좌표가 > b의 x좌표 + b의 폭보다 크지 않으면 return
            )
        },

		// 배경 초기화
        clear: function () {
            this.ctx.fillStyle = Game.color;
            this.ctx.fillRect(0, 0, this.c.width, this.c.height);
        },

		//일시 정지 함수
        pause: function () {
            this.paused = true;
        },
		//일시 정지 해제 함수
        unPause: function () {
            this.paused = false;
        },

		//게임 오버 함수
        gameOver: function () {
            this.isGameOver = true;
            this.clear();	//배경을 다 지움
            var message = "Game Over";
            var message2 = "Score: " + Game.score;
            var message3 = "Click or press Spacebar to Play Again";
            this.pause();	//일시 정지
            this.ctx.fillStyle = "white";
            this.ctx.font = "bold 30px Lato, sans-serif";
            this.ctx.fillText(message, this.c.width / 2 - this.ctx.measureText(message).width / 2, this.c.height / 2 - 50);
            this.ctx.fillText(message2, this.c.width / 2 - this.ctx.measureText(message2).width / 2, this.c.height / 2 - 5);
            this.ctx.font = "bold 16px Lato, sans-serif";
            this.ctx.fillText(message3, this.c.width / 2 - this.ctx.measureText(message3).width / 2, this.c.height / 2 + 30);
        },
		// 점수판 함수
        updateScore: function () {
            this.ctx.fillStyle = "white";
            this.ctx.font = "16px Lato, sans-serif";
            this.ctx.fillText("Score: " + this.score, 8, 20);
            this.ctx.fillText("Lives: " + (this.maxLives - this.life), 8, 40);
        },
		//게임 루프
        loop: function () {
            if (!Game.paused) {	//일시정지가 아니라면
                Game.clear();	//배경 초기화
                for (var i in Game.enemies) {	//적 그리기
                    var currentEnemy = Game.enemies[i];
                    currentEnemy.draw();
                    currentEnemy.update();
                    // 게임 프레임을 랜덤의 적 슈팅 스피드로 나눈 나머지가 0이면 발사사
                   if (Game.currentFrame % currentEnemy.shootingSpeed === 0) {
                        currentEnemy.shoot();
                    }
                }
                // Game.enemyBullets배열을 하나씩 꺼내서 그린다
                for (var x in Game.enemyBullets) {
                    Game.enemyBullets[x].draw();
                    Game.enemyBullets[x].update();
                }
                for (var z in Game.bullets) {
                    Game.bullets[z].draw();
                    Game.bullets[z].update();
                }
                //player 무적 상태라면
                if (Game.player.invincible) {
                	// 0.02초 마다 한번씩 그림
                    if (Game.currentFrame % 20 === 0) {
                        Game.player.draw();
                    }
                } else {
                    Game.player.draw();
                }
                // 터지는 효과 그리기
                for (var i in Game.particles) {
                    Game.particles[i].draw();
                }
                //지속적으로 업데이트
                Game.player.update();
                Game.updateScore();
                Game.currentFrame = Game.requestAnimationFrame.call(window, Game.loop);
            }
        }

    };//////게임 함수 끝


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
        this.vy = Game.random(1, 3) * .1;
        this.index = Game.enemyIndex;
        Game.enemies[Game.enemyIndex] = this;
        Game.enemyIndex++;
        this.speed = Game.random(2, 3);
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
    }

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