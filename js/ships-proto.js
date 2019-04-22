// Создает новый корабль
function Ship(team, type) {

	// Характеристики всех кораблей при их создании
	this.w = 20
	this.h = 20

	this.team = team

	if (team == "blue") this.image = images.ships.standart_blue
	if (team == "red") this.image = images.ships.standart_red

	this.speedUp = 0.3
	this.speedBrake = 0.04
	this.speedX = 0
	this.speedY = 0
	this.speed = 12
	this.maxSpeed = 12

	this.rotate = 0

	this.fireSpeed = 15
	this.fpsAfterShoot = this.fireSpeed


	this.standartFarmingTime = rand(3600, 3600*3)
	this.farmingTime = this.standartFarmingTime
	this.moveTo = {}

							// Стандартные функции для кораблей

	// Заспавнить корабль
	this.spawn = function() {

		if (this.team == "blue") {
			this.x = blackholes[0].centerX + blackholeCenterW/2 - 10
			this.y = blackholes[0].centerY + blackholeCenterW/2 - 10
		}

		if (this.team == "red") {
			this.x = blackholes[1].centerX + blackholeCenterW/2 - 10
			this.y = blackholes[1].centerY + blackholeCenterW/2 - 10
		}

		this.speedX = rand(-10, 10)
		this.speedY = rand(-10, 10)

	}


	// Физика движения
	this.moving = function() {

		// Сохраняем контекст вызова костылем для читабельности
		var that = this;

		(function maxSpeed() {
			if (that.speedX > that.maxSpeed) that.speedX = that.maxSpeed
			if (that.speedX < -that.maxSpeed) that.speedX = -that.maxSpeed
			if (that.speedY > that.maxSpeed) that.speedY = that.maxSpeed
			if (that.speedY < -that.maxSpeed) that.speedY = -that.maxSpeed
		})();

			// Тормозит корабль (в зависимости от +/- скорости -/+ speedBrake)
		(function stopShip() {
			if (that.speedX > 0) that.speedX -= that.speedBrake
			if (that.speedX < 0) that.speedX += that.speedBrake
			if (that.speedY > 0) that.speedY -= that.speedBrake
			if (that.speedY < 0) that.speedY += that.speedBrake

			// Тормозит, если слишком медленная скорость
			if (that.speedX <= that.speedBrake && that.speedX >= 0) that.speedX = 0
			if (that.speedX >= -that.speedBrake && that.speedX <= 0) that.speedX = 0
			if (that.speedY <= that.speedBrake && that.speedY >= 0) that.speedY = 0
			if (that.speedY <= that.speedBrake && that.speedY >= 0) that.speedY = 0

		})();

		(function move() {
			// Изменяем координаты корабля
			that.x += that.speedX
			that.y += that.speedY
		})();
		
		// Протестить
		(function breakNearTheBorder(){
			// Если корабль столкнулся  с краем карты - остановить
			if (that.x <= 0) { that.x = 0; that.speedX = 0 }
			if (that.x + that.w >= map.w) { that.x = map.w - that.w; that.speedX = 0 }
			if (that.y <= 0) { that.y = 0; that.speedY = 0 }
			if (that.y + that.h >= map.h) { mainShip.y = map.h - that.h; that.speedY = 0 }
		})();

	}





	// Определяет ближайщего врага и направляет курсор по его направлению
	this.setTargetForShooting = function() {


			this.setRotate = function() {

				this.rotate = 180 / Math.PI *
						Math.atan2
											(
												this.targetForShooting.y - this.y, 
												this.targetForShooting.x - this.x
											)
			}




			var nearestShip = {
				x: this.moveTo.x,
				y: this.moveTo.y,
				dist: 99999
			}

			// Проходится по всем вражеским кораблям и определяет ближайший
			for (var i = 0; i < ships.length; i++) {
				//if (this.team != ships[i].team) {
					iterations++


						var a = this.x - ships[i].x
						var b = this.y - ships[i].y


						var dist = Math.sqrt( a*a + b*b );

						if (dist < 300 && dist != 0) {

							if (dist < nearestShip.dist) {

								nearestShip.x = ships[i].x
								nearestShip.y = ships[i].y
								nearestShip.dist = dist

							}
						}

				}

				this.targetForShooting = {
					x: nearestShip.x, 
					y: nearestShip.y
				}

				this.setRotate()


				//}
			


	}


	this.setTeammaterForAttack = function() {

	}











	// Стандартное поведение для всех кораблей. Используется для того, чтобы не перезаписывать одну и ту же функцию дважды для главного корабля
	this.standartBehavior = function() {
		this.moving()
		this.setTargetForShooting()


	}





	this.behavior = function() {  
		this.standartBehavior()
	}


};






















var mainShip = new Ship("blue")

mainShip.behavior = function() {

		// Стандартное поведение для всех кораблей
		this.standartBehavior();


		// Поведение для главного корабля

		// Разгоняет корабль, если нажата клавиша
		(function changeSpeed() {
			if(keyboardPressed.w) mainShip.speedY -= mainShip.speedUp
			if(keyboardPressed.a) mainShip.speedX -= mainShip.speedUp
			if(keyboardPressed.s) mainShip.speedX += mainShip.speedUp
			if(keyboardPressed.d) mainShip.speedY += mainShip.speedUp
		})();


		(function rotate() {
			// Поворачивает корабль

			// Находим угол А между центром корабля (точкой a) и координатой мышки (точкой b)
			// Math.atan2(a - координаты точки a(курсора), b - координаты центра корабля)
			//     .b
			//    ..
			//   . . A
			// a....
			//   B

			mainShip.rotate = 180 / Math.PI * Math.atan2(cursor.y - (canvas.height/2), 
																										 cursor.x - (canvas.width/2)
																										 )
		})();




		(function makeShoot() {
				// fpsAfterShoot - регулятор частоты выстрелов. Каждый кадр он прибавляется и при достижении определенной отметки он позволяет сделать новый выстрел
				// Затем он обнулятеся
				mainShip.fpsAfterShoot++

				if (cursor.isPressed) {
						// Если прошло достаточно времени с прошлого выстрела
						if (mainShip.fpsAfterShoot > mainShip.fireSpeed) {

								shoots.push({
									w: 7, h: 20,
									x: mainShip.x + 43, y: mainShip.y,
									team: "blue",
									rotate: mainShip.rotate - 90,
									speed: 20,
									color: "#00FFA9"
								})
								mainShip.fpsAfterShoot = 0

							}
				}
			})();


	}
