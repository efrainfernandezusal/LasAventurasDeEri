var game = function() {

	var Q = window.Q = Quintus()
			.include(["Sprites", "Scenes", "Input", "2D", "UI", "Anim", "TMX", "Audio", "Touch"])
			.setup("myGame",
			{
				width: 800,
				height: 300,
				maximize: true,
				scaleToFit: true	//Para que reescale
			})
			.controls().enableSound().touch();

			// Para no difuminar los pixeles
			Q.setImageSmoothing(false);


//----------------------------------SPRITES---------------------------------------------------//	 
	//--------------------------------------------------------------//
	//----------------------------MAIN------------------------------//
	//--------------------------------------------------------------//
	Q.Sprite.extend("Main", {
		
		init: function(p) {
			this._super(p,{
				sheet: "main",
				sprite: "main_anim",
				x: 400,
				y: 200,
				frame: 1,
				scale: 1
			});

			//Añadimos gravedad y controles básicos
			this.add("2d, platformerControls, animation, tween");

			//Cuando se de el evento up, se llama a la funcion this
			Q.input.on("up", this, function(){
				if(this.p.vy == 0)
					Q.audio.play("salto.mp3");
			});

			this.play("comienzo");

		},
	    step: function(dt){
			//--------------CAMBIO DE MAPAS--------------//

			// Entrada al nivel de secuenciacion 
			if (this.p.x > 800  && this.stage.scene.name == "mapa1") {
				this.stage.add("viewport").follow(main,{x:false, y:false});
				if(this.p.x > 1400){
					Q.stageScene("tutorial1", 1);
				}
			}

			// Entrada al nivel de modulacion
			if (this.p.x > 800 && this.stage.scene.name == "mapa2") {
				this.stage.add("viewport").follow(main,{x:false, y:false});
				if(this.p.x > 1400){
					Q.stageScene("tutorial2", 1);
				}
			}
			
			/*
			var taken = false;
			if(this.p.x > 1350 && this.p.x < 1400){
				if(taken)
					return;
				taken = true;

				button = new Q.UI.Button({x: Q.width/2, y: Q.height/2, w: 605, h: 259, scale: 1, asset: "controles__tutorialbarra.png"});
				stage.insert(button);
			}*/

			// Entrada al nivel de similitud de patrones
			if (this.p.x > 1350 && this.p.x < 1400 &&this.stage.scene.name == "mapa3" && Q.inputs["fire"]) {
				Q.audio.play("puerta.mp3");
				setTimeout(function(){
					Q.stageScene("tutorial3", 1);
				},600);
			}

			//------------Animación del personaje-------------//
			if(this.p.vx > 0){	//Si se mueve a la derecha
				this.play("walk_right");
			}else if(this.p.vx < 0){
				this.play("walk_left");
			}
			
			// Animacion de main caminando hacia delante
			if(Q.inputs["fire"]){
				this.play("move");
			}

			// Animacion de main saltando
			if(this.p.vy < 0){	//Si salta
				if(this.p.vx > 0){	//Si se mueve a la derecha
					this.play("jump_right");
				}else if(this.p.vx < 0){
					this.play("jump_left");
				}
			}

			// Animacion de main cayendo
			if(this.p.vy > 0){	//Si salta
				if(this.p.vx > 0){	//Si se mueve a la derecha
					this.play("fall_right");
				}else if(this.p.vx < 0){
					this.play("fall_left");
				}
			}
		}
	});

	
	Q.Sprite.extend("Mon", {
		
		init: function(p) {
			this._super(p,{
				sprite: "mon_anim",
				sheet: "mon",
				x: 1600,
				y: 100,
				frame: 1,
				scale:0.1,
				vx: 100,		//velocidad de Mon
				taken: false
			});
		
			//Añadimos gravedad y controles básicos
			this.add("2d, aiBounce, animation");
			this.on("bump.left", this, "find");	
			this.on("bump.right", this, "find");	

		},
		step(dt){
			if(this.p.vx > 0){	//Si se mueve a la derecha
	    		this.play("walk_right");
	    	}else if(this.p.vx < 0){
	    		this.play("walk_left");
	    	}
		},
		find: function(collision){
			if(this.taken) return;		//Si ya está cogida sale

	    	if(!collision.obj.isA("Main"))		return;	//Para que solo colisione con Mario
	    	
	    	Q.clearStages();
			Q.stageScene("win",1);
		}
	});

	Q.Sprite.extend("Cube1Sensor", {
		
		init: function(p) {
			this._super(p,{
				sheet: "cube1",
				x: 600,
				y: 250,
				frame: 0,
				scale: 0.75,
				sensor: true
			});
			
			this.add("tween");
		}
	});

	Q.Sprite.extend("Puerta", {
		
		init: function(p) {
			this._super(p,{
				sheet: "puerta",
				x: 1370,
				y: 190,
				frame: 0,
				scale: 0.7,
				sensor: true
			});
		
			this.add("tween");
		}
	});

	Q.Sprite.extend("Arbol", {
		
		init: function(p) {
			this._super(p,{
				sheet: "arbol",
				x: 1370,
				y: 170,
				frame: 0,
				scale: 0.7,
				sensor: true
			});
		
			this.add("tween");
		}
	});

	//--------------------------------------------------------------//
	//----------------------------SEQUENCE--------------------------//
	//--------------------------------------------------------------//
	Q.Sprite.extend("Cubo1", {
		
		init: function(p) {
			this._super(p,{
				sheet: "cubo1",
				x: 600,
				y: 250,
				frame: 0,
				scale: 0.75
			});
		}
	});

	Q.Sprite.extend("Cubo2", {
		
		init: function(p) {
			this._super(p,{
				sheet: "cubo2",
				x: 600,
				y: 250,
				frame: 0,
				scale: 0.75
			});
		}
	});

	Q.Sprite.extend("Flecha", {
		
		init: function(p) {
			this._super(p,{
				sprite: "flecha",
				y: 350,
				frame: 0,
				scale: 0.5
			});
		}
	});

	Q.Sprite.extend("Main2", {
		
		init: function(p) {
			this._super(p,{
				sprite: "main2",
				sheet: "main2",
				x: 600,
				y: 250,
				frame: 0,
				scale: 0.45
			});
		}
	});

	//--------------------------------------------------------------//
	//--------------------------FRUTAS------------------------------//
	//--------------------------------------------------------------//
	Q.Sprite.extend("Caja", {
		
		init: function(p) {
			this._super(p,{
				sheet: "caja",
				x: 600,
				y: 100,
				frame: 0,
				scale: 1,
				jumpSpeed: 0	// Cancelamos el salto de la caja
			});
			
			//Añadimos gravedad y controles básicos
			this.add("2d, platformerControls, animation");
		}
	});

	// Frutas que no hay que recolectar
	Q.Sprite.extend("Fruta", {
		init: function(p) {
			this._super(p,{
				sprite: "frutas",
				x: 400+(Math.random()*500),		// Para que aparezca en lugar random
				y: -20,
				frame: 0,
				scale: 0.5,
				gravity: 0.01,
				sensor: true,		//Para que las frutas se atraviesen entre si
				taken: false		//Para que no haga tantas colisiones como fps haya
			});
			//Añadimos gravedad y controles básicos
			this.add("2d, tween");
			this.on("bump.bottom", this, "no_recolected");	//Llama a recolected de este objeto
		},
		no_recolected: function(collision){
			if(collision.obj.isA("Caja")){
				if(this.taken) return;		//Si ya está cogida sale

				// Decrementamos las vidas
				Q.state.get("vidas");
				Q.state.dec("vidas", 1);

				this.taken = true;

				if(Q.state.get("vidas") == 0){
					Q.clearStages();
					Q.stageScene("endGame",1);
				}

				//Q.audio.play("fruta.mp3");

				// Animación para sacar la fruta en la caja
				this.animate({x: this.p.x-100 ,y: this.p.y-300, angle: 540},
					1, 
					Q.Easing.Quadratic.InOut,
					{callback: function(){
						this.destroy();
					}});
			// Collision con las frutas
			}else if(collision.obj.isA("Fruta") || collision.obj.isA("Frutas_selected")){
				return;
			}else{
				this.destroy();
			}
		}
	});

	// Frutas que si se pueden recolectar
	Q.Sprite.extend("Frutas_selected", {
		init: function(p) {
			this._super(p,{
				sprite: "frutas_selected",
				x: 400+(Math.random()*500),
				y: -20,
				frame: 0,
				scale: 0.5,
				gravity: 0.01,
				sensor: true,		
				taken: false		//Para que no haga tantas colisiones como fps haya
			});
			//Añadimos gravedad y controles básicos
			this.add("2d, tween");
			this.on("bump.bottom", this, "recolected");	//Llama a recolected de este objeto
		},
		recolected: function(collision){
			// Hay que hacer distinto si es con el suelo o con la caja
			if(collision.obj.isA("Caja")){
				if(this.taken) return;		//Si ya está cogida sale
				Q.audio.play("fruta.mp3");
				Q.state.get("frutas")
				Q.state.inc("frutas", 1);

				// Si llegamos a 5 frutas recolectadas, pasamos de nivel
				if(Q.state.get("frutas") == 5){
					Q.stage().pause();  
					setTimeout(function(){ 
						Q.stageScene("barra_puerta", 1);
					}, 500);
				}
				this.taken = true;

				

				// Animación para meter la fruta en la caja
				this.animate({y: this.p.y-30, angle: 360},
					1, 
					Q.Easing.Quadratic.InOut,
					{callback: function(){
						this.destroy();
					}});
			}else if(collision.obj.isA("Fruta") || collision.obj.isA("Frutas_selected")){
				return;
			}else{
				this.destroy();
			}
		}
	});

	Q.Sprite.extend("Suelo", {
		init: function(p) {
			this._super(p,{
				sheet: "suelo",
				y: 294,
				frame: 0,
				scale: 1
			});
			this.add("2d");
		}
	});

	//--------------------------------------------------------------//
	//----------------------------COPY------------------------------//
	//--------------------------------------------------------------//
	Q.Sprite.extend("Cube1", {
		
		init: function(p) {
			this._super(p,{
				sheet: "cube1",
				x: 600,
				y: 250,
				frame: 0,
				scale: 0.75
			});
		}
	});

	Q.Sprite.extend("Cube2", {
		
		init: function(p) {
			this._super(p,{
				sheet: "cube2",
				x: 600,
				y: 250,
				frame: 0,
				scale: 0.75
			});	
		}
	});

//--------------------------------CARGA DE ELEMENTOS-------------------------------------------//	 
	Q.load(["barra_puerta.png", "win.png", "titulo.png", "endGame.png", "mon.png", "mon.json", "soundtrack_sequence.mp3", "soundtrack_portada.mp3", "soundtrack_mapa123.mp3", "soundtrack_mapa4.mp3", "soundtrack_frutas.mp3", "soundtrack_copy.mp3", "boton.mp3", "fruta.mp3", "salto.mp3", "pasos.mp3", "puerta.mp3", "controles__tutorialbarra.png", "tutorial__0.png", "tutorial__1.png", "tutorial__2.png", "tutorial__3.png", "controles__tutorial1.png", "controles__tutorial2.png", "controles__tutorial3.png", "controles__tutorialbarra.png", "arbol.png", "arbol.json", "puerta.png", "puerta.json", "background_copy.png", "map_copy.tmx", "background_fruit.png", "map_fruit.tmx", "mapa2.tmx", "mapa3.tmx", "mapa4.tmx", "degradado1.png", "degradado3.png","degradado4.png","degradado5.png", "tiles.tsx", "tiles.png", "mapa1.tmx", "suelo.json", "suelo.png", "frutas_selected.json", "frutas_selected.png", "passed.png", "cubo_solution.png", "comprobar.png", "cubo2.png", "cubo2.json", "cubo1.png", "cubo1.json", "main2.png", "main2.json", "flecha.png", "flecha.json", "cube2.png", "cube2.json", "cube1.png", "cube1.json", "sequence.tmx", "frutas.png", "frutas.json", "caja.json", "caja.png", "bosque_extended.png", "main.json", "main.png"], function() {
	 
		// Compilación de las imágenes con sus correspondientes JSON
		Q.compileSheets("main.png","main.json");
		Q.compileSheets("frutas_selected.png","frutas_selected.json");
		Q.compileSheets("flecha.png","flecha.json");
		Q.compileSheets("mon.png","mon.json");
		Q.compileSheets("puerta.png","puerta.json");
		Q.compileSheets("arbol.png","arbol.json");
		Q.compileSheets("suelo.png","suelo.json");
		Q.compileSheets("main2.png","main2.json");
		Q.compileSheets("cube1.png","cube1.json");
		Q.compileSheets("cube2.png","cube2.json");
		Q.compileSheets("cubo1.png","cubo1.json");
		Q.compileSheets("cubo2.png","cubo2.json");
		Q.compileSheets("caja.png","caja.json");
		Q.compileSheets("frutas.png","frutas.json");

		Q.animations("main_anim",{
			walk_right: {frames: [4,5,6], rate: 1/6, next: "parado_r"},
			walk_left: {frames: [9,10,11], rate: 1/6, next: "parado_l"},
			jump_right: {frames: [4,5], rate: 1/6, next: "parado_r"},
			jump_left: {frames: [9,10], rate: 1/6, next: "parado_l"},
			fall_right: {frames: [6], rate: 1/6, next: "parado_r"},
			fall_left: {frames: [11], rate: 1/6, next: "parado_l"},
			parado_r: {frames: [7] },
			parado_l: {frames: [8] },
			move: {frames: [12,13,14,15], rate: 1/4},
			comienzo: {frames: [1], loop:false, rate:1}
		});

		Q.animations("mon_anim",{
			walk_right: {frames: [0,1], rate: 1/6},
			walk_left: {frames: [2,3], rate: 1/6}
		});
//--------------------------------MAPA PRINCIPAL-------------------------------------------------//	  
		//--------------------------------------------------------------//
		//--------------------------MAPA1-------------------------------//
		//--------------------------------------------------------------//
	   	Q.scene("mapa1", function(stage) {
			Q.stageTMX("mapa1.tmx", stage);

			for(let i = 0; i < 3; i++){
				for(let j = 0; j < 4; j++){

					// Creamos las diferentes coordenadas del tablero
					new_x = 1375 + 35*i;
					new_y = 116 + 35*j;

					cube1 = new Q.Cube1Sensor({x: new_x, y: new_y, scale: 0.5, hidden: false});
					stage.insert(cube1);
				}
			}

			main = new Q.Main({x:150});
			stage.insert(main);
			
			stage.add("viewport").follow(main,{x:true, y:false});
			stage.viewport.scale = 1;
			stage.viewport.offsetX = -200;

			//Iniciamos variables globales
			//Q.state.reset({"vidas": 2});

			//Iniciamos la música
			Q.audio.play("soundtrack_mapa123.mp3", {loop:true});
		});

		//--------------------------------------------------------------//
		//--------------------------MAPA2-------------------------------//
		//--------------------------------------------------------------//
		Q.scene("mapa2", function(stage) {
			Q.stageTMX("mapa2.tmx", stage);

			// Dibujamos los árboles para el cambio de mapa
			for(let i = 0; i < 7; i++){
				arbol = new Q.Arbol({x:(1300+16*i)});
				stage.insert(arbol);

				arbol = new Q.Arbol({x:(1240+30*i), scale: 0.5, y: 190});
				stage.insert(arbol);

				arbol = new Q.Arbol({x:(1270+15*i), scale: 0.5, y: 190});
				stage.insert(arbol);
			}
			
			main = new Q.Main({x:150});
			stage.insert(main);
			
			stage.add("viewport").follow(main,{x:true, y:false});
			stage.viewport.scale = 1;
			stage.viewport.offsetX = -200;

			/*
			stage.on("destroy",function() {
				mario.destroy();
			});*/

			//Iniciamos variables globales
			//Q.state.reset({vidas: 2});

			//Iniciamos la música
			Q.audio.stop(); 
			Q.audio.play("soundtrack_mapa123.mp3", {loop:true});
		});

		//--------------------------------------------------------------//
		//--------------------------MAPA3-------------------------------//
		//--------------------------------------------------------------//
		Q.scene("mapa3", function(stage) {
			Q.stageTMX("mapa3.tmx", stage);

			puerta = new Q.Puerta();
			stage.insert(puerta);

			main = new Q.Main();
			stage.insert(main);
			
			stage.add("viewport").follow(main,{x:true, y:false});
			stage.viewport.scale = 1;
			stage.viewport.offsetX = -200;

			/*
			stage.on("destroy",function() {
				//mario.destroy();
			});*/

			//Iniciamos la música
			Q.audio.stop(); 
			Q.audio.play("soundtrack_mapa123.mp3", {loop:true});
		});

		//--------------------------------------------------------------//
		//--------------------------MAPA4-------------------------------//
		//--------------------------------------------------------------//
		Q.scene("mapa4", function(stage) {
			Q.stageTMX("mapa4.tmx", stage);
			main = new Q.Main();
			stage.insert(main);

			mon = new Q.Mon();
			stage.insert(mon);
			
			stage.add("viewport").follow(main,{x:true, y:false});
			stage.viewport.scale = 1;
			stage.viewport.offsetX = -200;

			stage.on("destroy",function() {
				//mario.destroy();
			});

			Q.audio.stop(); 
			Q.audio.play("soundtrack_mapa4.mp3", {loop:true});
		});

//--------------------------------TUTORIALES-------------------------------------------------//	  
		//--------------------------------------------------------------//
		//--------------------------TUTORIAL0---------------------------//
		//--------------------------------------------------------------//
		Q.scene("tutorial0", function(stage) {
			button = new Q.UI.Button({x: Q.width/2, y: Q.height/2, w: 605, h: 259, scale: 1, asset: "tutorial__0.png"});
			stage.insert(button);

			// Creamos el evento click para el botón
			button.on("click", function(){
					Q.stageScene("mapa1", 1);
			});
		});

		//--------------------------------------------------------------//
		//--------------------------TUTORIAL1---------------------------//
		//--------------------------------------------------------------//
		Q.scene("tutorial1", function(stage) {
			button = new Q.UI.Button({x: Q.width/2, y: Q.height/2, w: 605, h: 259, scale: 1, asset: "tutorial__1.png"});
			stage.insert(button);

			var contador = 0;
			// Creamos el evento click para el botón y pasar a la siguiente página de tutorial
			button.on("click", function(){
				if(contador == 0){
					button = new Q.UI.Button({x: Q.width/2, y: Q.height/2, w: 605, h: 259, scale: 1, asset: "controles__tutorial1.png"});
					stage.insert(button);
					contador = 1;
				}else{
					Q.stageScene("sequence_level", 1);
				}
			});
		});

		//--------------------------------------------------------------//
		//--------------------------TUTORIAL2---------------------------//
		//--------------------------------------------------------------//
		Q.scene("tutorial2", function(stage) {
			button = new Q.UI.Button({x: Q.width/2, y: Q.height/2, w: 605, h: 259, scale: 1, asset: "tutorial__2.png"});
			stage.insert(button);

			var contador = 0;
			// Creamos el evento click para el botón
			button.on("click", function(){
				if(contador == 0){
					button = new Q.UI.Button({x: Q.width/2, y: Q.height/2, w: 605, h: 259, scale: 1, asset: "controles__tutorial2.png"});
					stage.insert(button);
					contador = 1;
				}else{
					Q.stageScene("fruit_level", 1);
				}
			});
		});
		//--------------------------------------------------------------//
		//--------------------------PUERTA------------------------------//
		//--------------------------------------------------------------//
		Q.scene("barra_puerta", function(stage) {
			button = new Q.UI.Button({x: Q.width/2, y: Q.height/2, w: 605, h: 259, scale: 1, asset: "barra_puerta.png"});
			stage.insert(button);

			// Creamos el evento click para el botón
			button.on("click", function(){
					Q.stageScene("mapa3", 1);
			});
		});

		//--------------------------------------------------------------//
		//--------------------------TUTORIAL3---------------------------//
		//--------------------------------------------------------------//
		Q.scene("tutorial3", function(stage) {
			button = new Q.UI.Button({x: Q.width/2, y: Q.height/2, w: 605, h: 259, scale: 1, asset: "tutorial__3.png"});
			stage.insert(button);

			var contador = 0;
			// Creamos el evento click para el botón
			button.on("click", function(){
				if(contador == 0){
					button = new Q.UI.Button({x: Q.width/2, y: Q.height/2, w: 605, h: 259, scale: 1, asset: "controles__tutorial3.png"});
					stage.insert(button);
					contador = 1;
				}else{
					Q.stageScene("copy_level", 1);
				}
			});
		});

		
		
//--------------------------------NIVELES-------------------------------------------------//	
		//--------------------------------------------------------------//
		//----------------------SEQUENCE LEVEL--------------------------//
		//--------------------------------------------------------------//
		Q.scene("sequence_level", function(stage) {
			//--------------------CARGA DEL NIVEL-------------------//
			Q.audio.stop(); 
			Q.audio.play("soundtrack_sequence.mp3", {loop:true});

			// Añadimos el viewport
			stage.add("viewport");
			stage.viewport.scale = 0.75;
			
			// Para realizar la secuencia de teclas
			// Bucle for de 5 iteraciones, cambiando las coordenadas de x
			// Establecemos un codigo dependiendo de la secuencia, y se comprueba si se cumple ese codigo
			var counter = 0;

			// Coordenadas de cada punto del tablero (el tablero será una matriz de coordenadas)
			var coordinates = [];

			// Imprimimos el tablero
			// Este contador servirá para numerar cada casilla del tablero
			var cont = 0;
			for(let i = 0; i < 4; i++){
				for(let j = 0; j < 4; j++){

					// Creamos las diferentes coordenadas del tablero
					new_x = 430 + 50*i;
					new_y = 100 + 50*j;
					// Rellenamos la matriz de coordenadas
					coordinates[cont] = [new_x, new_y];

					// Ponemos las condiciones para pintar el tablero
					if((i == 2 && j == 0) || (i == 1 && j == 1) || (i == 2 && j == 1) || (i == 1 && j == 2) || (i == 1 && j == 3)){
						// Elegimos el nivel según los cubos que pintamos de amarillo para salir del laberinto
						cube2 = new Q.Cube2({x: new_x, y: new_y, hidden: false});
						stage.insert(cube2);
					}else{
						// El resto de cubos serán cubos de tipo "pared"
						cube1 = new Q.Cube1({x: new_x, y: new_y, hidden: false});
						stage.insert(cube1);
					}
					// Incrementamos el contador
					cont++;
				}
			}

			// Añadimos una coordenada de fuera
			coordinates[16] = [750, 175];

			// Codigo correcto para pasar el nivel -> Se comparará con la variable code
			var codigo_final = 22322;

			// Creamos la variable coord_inicio, que es la coordenada en la que empieza el personaje
			var coord_inicio;

			// Movimiento del personaje -> Contendrá las coordenadas por las que 
			// pasará nuestro personaje para intentar pasar el nivel
			var mov = [];

			// Creamos un array para ir guardando el código que vamos conformando
			// Este codigo se compondrá de un codigo creado según los movimientos de las flechas
			var code = [];
			
			var main_coord, main2;
			
			// Creamos la variable para el setInterval posterior para reproducir el movimiento
			var interval_movimiento;

			// Creamos una variable por si nos salimos del tablero
			var fuera;

			inicio_sequence();

			function inicio_sequence(){
				counter = 0;
				coord_inicio = 7;
				mov = [];
				code = [];
				main_coord = [];
				for(let i = 0; i < 5; i++){
					mov[i] = 0;
					code[i] = 0;
				}

				// Guardamos la primera coordenada en la que está el personaje
				mov[0] = coord_inicio;
				
				// main_coord será el array que contendrá las coordenadas exactas de la casilla correspondiente
				main_coord = coordinates[coord_inicio];

				main2 = new Q.Main2({x: main_coord[0], y: main_coord[1]});
				stage.insert(main2);

				fuera = 0;

				addEventListener("keydown", evento_teclas);
			}

			// Se crea un event listener de la presión de las teclas de las flechas
			function evento_teclas(e){
				// Se van moviendo de coordenadas las flechas para crear la animación
				switch(counter){
					case 0:	x_new = 300; break;
					case 1:	x_new = 400; break;
					case 2:	x_new = 500; break;
					case 3:	x_new = 600; break;
					case 4:	x_new = 700; break;
				}

				if(e.keyCode == 37){
					// CODIGO 1 - IZQUIERDA
					// Llamamos a fuera del tablero si nos pasamos de casilla
					if(coord_inicio == 0 || coord_inicio == 1 || coord_inicio == 2 || coord_inicio == 3){
						fuera = 1;
					}else{
						code[counter] = 1;
						flecha = new Q.Flecha({sheet: "flecha2", x: x_new});
						stage.insert(flecha);

						// Cambiamos el índice del tablero donde iría el personaje si todo es correcto
						coord_inicio -= 4;
						mov[counter] = coord_inicio;
					}
				}
				if(e.keyCode == 38){
					// CODIGO 2 - ARRIBA
					// Quitamos de las coordenadas consideradas como fuera la coordenada ganadora
					if(coord_inicio == 0 || coord_inicio == 4 || coord_inicio == 12){
						fuera = 1;
					}else{
						code[counter] = 2;
						flecha = new Q.Flecha({sheet: "flecha3", x: x_new});
						stage.insert(flecha);

						coord_inicio -= 1;
						mov[counter] = coord_inicio;
					}
				}
				if(e.keyCode == 39){
					// CODIGO 3 - DERECHA
					if(coord_inicio == 12 || coord_inicio == 13 || coord_inicio == 14 || coord_inicio == 15){
						fuera = 1;
					}else{
						code[counter] = 3;
						flecha = new Q.Flecha({sheet: "flecha1", x: x_new});
						stage.insert(flecha);

						coord_inicio += 4;
						mov[counter] = coord_inicio;
					}
				}
				if(e.keyCode == 40){
					// CODIGO 4 - ABAJO
					if(coord_inicio == 3 || coord_inicio == 7 || coord_inicio == 11 || coord_inicio == 15){
						fuera = 1;
					}else{
						code[counter] = 4;
						flecha = new Q.Flecha({sheet: "flecha4", x: x_new});
						stage.insert(flecha);

						coord_inicio += 1;
						mov[counter] = coord_inicio;
					}
				}

				// Aumentamos el contador
				counter++;

				// Se comprueba si la secuencia es correcta
				if(counter == 5 || fuera == 1){
					comprueba();
				}
			}
			
			function comprueba(){
				// Convertimos el codigo a un numero para comprobar su validez junto con el código válido
				final_code = code[0] + code[1]*10 + code[2]*100 + code[3]*1000 + code[4]*10000;
				if(final_code == codigo_final){
					removeEventListener("keydown", evento_teclas, function(){});
					console.log("Correcto");
					interval_movimiento = setInterval(movimiento, 1000);

					// Para realizar la animación del final del movimiento y poner fuera el personaje
					setTimeout(function(){
						main_coord = coordinates[16];
						main2.set({x: main_coord[0], y: main_coord[1]});
					}, 5000);
					
				// Se hace la animación pero no es correcta
				}else if(fuera == 0){
					removeEventListener("keydown", evento_teclas, function(){});
					
					// Llamamos a la función que realiza el movimiento y reinicia
					interval_movimiento = setInterval(movimiento_reinicia, 1000);

				// Se va fuera y no llega a 5 movimientos, se reinicia
				}else{
					removeEventListener("keydown", evento_teclas, function(){});

					Q.state.get("vidas");
					Q.state.dec("vidas", 1);

					if(Q.state.get("vidas") == 0){
						console.log("Has perdido");
						Q.clearStages();
						Q.stageScene("endGame");
					}else{
						reinicio();
					}
				}
			}
			// Creamos la función movimiento para que el personaje realice el recorrido tras la secuencia
			var contador_movimiento = 0;
			function movimiento(){
				coord_inicio = mov[contador_movimiento];
				main_coord = coordinates[coord_inicio];

				main2.set({x: main_coord[0], y: main_coord[1]});
				contador_movimiento++;
				if(contador_movimiento == 5){
					clearInterval(interval_movimiento);
					var passed = new Q.UI.Button({x: 501, y: 175, w: 240, h: 60, scale: 0.70, asset: "passed.png"});
					stage.insert(passed);
					
					setTimeout(function(){ 
						Q.stageScene("mapa2", 1);
					}, 500);
				}
			}

			function movimiento_reinicia(){
				coord_inicio = mov[contador_movimiento];
				main_coord = coordinates[coord_inicio];

				main2.set({x: main_coord[0], y: main_coord[1]});
				contador_movimiento++;
				if(contador_movimiento == 5){
					clearInterval(interval_movimiento);
					Q.state.get("vidas");
					Q.state.dec("vidas", 1);

					// Esperamos a que acabe el movimiento
					setTimeout(function(){
						if(Q.state.get("vidas") == 0){
							Q.clearStages();
							Q.stageScene("endGame",1);
						}else{
							reinicio();
						}
					}, 500);
				}
			}

			function reinicio(){
				Q.stageScene("sequence_level", 1);
			}
		});


		//--------------------------------------------------------------//
		//--------------------------FRUTAS------------------------------//
		//--------------------------------------------------------------//
		Q.scene("fruit_level", function(stage) {
			// Añadimos la música al escenario, en bucle
			Q.audio.stop(); 
			Q.audio.play("soundtrack_frutas.mp3", {loop:true});

			// Añadimos el mapa
			Q.stageTMX("map_fruit.tmx", stage);

			// Dibujamos el suelo esta vez en baldosas para la colision con las frutas
			for(let i = 0; i < 52; i++){
				var suelo = new Q.Suelo({x:(200+16*i)});
				stage.insert(suelo);
			}
			
			// Insertamos la caja en el escenario
			var caja = new Q.Caja();
			stage.insert(caja);

			// Añadimos doble viewport para que la caja quede centrada y que la cámara no la siga
			stage.add("viewport").follow(caja,{x:350, y:false});
			stage.add("viewport").follow(caja,{x:false, y:false});
			stage.viewport.scale = 1;

			//---------------------------CONTADOR DE FRUTAS--------------//
			//Q.state.reset({ frutas: 0});
			label_frutas = new Q.UI.Text({x:260, y:23, label: "frutas: 0", color: "white"});
			stage.insert(label_frutas);

			//Registrar un evento de cambio de frutas	
			//Utilizamos la funcion anonima
			Q.state.on("change.frutas", this, function(){
				label_frutas.p.label = "frutas: "+Q.state.get("frutas");
			})

			// Añadimos un botón con una imagen que muestre las frutas a recolectar
			var selected_fruit_button = stage.insert(new Q.UI.Button({
				x: 260, y: 60, w: 240, h: 60, scale: 0.50, asset: "frutas_selected.png"
			}));
			//-----------------------------------------------------------//

			//Variables para las frutas
			var fruta, fruta_sheet, frutas_selected;

			// Funcion para obtener un numero random entre dos numeros
			function random_numer(min,max){
				return parseInt(Math.random()*(max-min)) + min;
			}

			// Y otra que haga que caigan las frutas que queremos
			function frutas_caen(){
				// Generamos un nº aleatorio para que vayan cayendo distintas frutas irrelevantes
				fruta_sheet = random_numer(1,10);
				// Creamos cada fruta
				fruta = new Q.Fruta({sheet: fruta_sheet});
				
				stage.insert(fruta);
			}

			function frutas_selected_caen(){
				fruta_sheet = random_numer(10,14);
				// Creamos cada fruta
				frutas_selected = new Q.Frutas_selected({sheet: fruta_sheet});
				
				stage.insert(frutas_selected);
			}

			// Añadimos los setInterval para que las frutas caigan periodicamente
			setInterval(frutas_caen, 1000);
			setInterval(frutas_selected_caen, 3000);
			
			//El contador se gestiona desde las entidades correspondientes
		});

		//--------------------------------------------------------------//
		//------------------------COPY LEVEL----------------------------//
		//--------------------------------------------------------------//
		Q.scene("copy_level", function(stage) {
			// Añadimos la música
			Q.audio.stop(); 
			Q.audio.play("soundtrack_copy.mp3", {loop:true});

			// Cargamos el mapa
			Q.stageTMX("map_copy.tmx", stage);

			// Creamos la matriz de puntos tanto lógica como dibujada en buttons
			var matriz_button = [];
			for(let i = 0; i < 16; i++)
				matriz_button[i] = 0;

			var button0 = new Q.UI.Button({x: 313, y: 50, w: 75, h: 75, scale: 0.60, asset: "cubo2.png"});	
			var button1 = new Q.UI.Button({x: 313, y: 100, w: 75, h: 75, scale: 0.60, asset: "cubo2.png"});
			var button2 = new Q.UI.Button({x: 313, y: 150, w: 75, h: 75, scale: 0.60, asset: "cubo2.png"});
			var button3 = new Q.UI.Button({x: 313, y: 200, w: 75, h: 75, scale: 0.60, asset: "cubo2.png"});
			var button4 = new Q.UI.Button({x: 363, y: 50, w: 75, h: 75, scale: 0.60, asset: "cubo2.png"});
			var button5 = new Q.UI.Button({x: 363, y: 100, w: 75, h: 75, scale: 0.60, asset: "cubo2.png"});
			var button6 = new Q.UI.Button({x: 363, y: 150, w: 75, h: 75, scale: 0.60, asset: "cubo2.png"});
			var button7 = new Q.UI.Button({x: 363, y: 200, w: 75, h: 75, scale: 0.60, asset: "cubo2.png"});
			var button8 = new Q.UI.Button({x: 413, y: 50, w: 75, h: 75, scale: 0.60, asset: "cubo2.png"});
			var button9 = new Q.UI.Button({x: 413, y: 100, w: 75, h: 75, scale: 0.60, asset: "cubo2.png"});
			var button10 = new Q.UI.Button({x: 413, y: 150, w: 75, h: 75, scale: 0.60, asset: "cubo2.png"});
			var button11 = new Q.UI.Button({x: 413, y: 200, w: 75, h: 75, scale: 0.60, asset: "cubo2.png"});
			var button12 = new Q.UI.Button({x: 463, y: 50, w: 75, h: 75, scale: 0.60, asset: "cubo2.png"});
			var button13 = new Q.UI.Button({x: 463, y: 100, w: 75, h: 75, scale: 0.60, asset: "cubo2.png"});
			var button14 = new Q.UI.Button({x: 463, y: 150, w: 75, h: 75, scale: 0.60, asset: "cubo2.png"});
			var button15 = new Q.UI.Button({x: 463, y: 200, w: 75, h: 75, scale: 0.60, asset: "cubo2.png"});

			// Código solución
			var cubo_solution = new Q.UI.Button({x: 670, y: 140, w: 351, h: 354, scale: 0.20, angle: 180, asset: "cubo_solution.png"});
			
			// Los insertamos
			stage.insert(button0);
			stage.insert(button1);
			stage.insert(button2);
			stage.insert(button3);
			stage.insert(button4);
			stage.insert(button5);
			stage.insert(button6);
			stage.insert(button7);
			stage.insert(button8);
			stage.insert(button9);
			stage.insert(button10);
			stage.insert(button11);
			stage.insert(button12);
			stage.insert(button13);
			stage.insert(button14);
			stage.insert(button15);

			stage.insert(cubo_solution);

			// Creamos el evento click para cada botón
			button0.on("click", function(){
				Q.audio.play("boton.mp3");
				if(matriz_button[0] == 0){
					button0.set({asset: "cubo1.png"});
					matriz_button[0] = 1;
				}else{
					button0.set({asset: "cubo2.png"});
					matriz_button[0] = 0;
				}
			});
			button1.on("click", function(){
				Q.audio.play("boton.mp3");
				if(matriz_button[1] == 0){
					button1.set({asset: "cubo1.png"});
					matriz_button[1] = 1;
				}else{
					button1.set({asset: "cubo2.png"});
					matriz_button[1] = 0;
				}
			});
			button2.on("click", function(){
				Q.audio.play("boton.mp3");
				if(matriz_button[2] == 0){
					button2.set({asset: "cubo1.png"});
					matriz_button[2] = 1;
				}else{
					button2.set({asset: "cubo2.png"});
					matriz_button[2] = 0;
				}
			});
			button3.on("click", function(){
				Q.audio.play("boton.mp3");
				if(matriz_button[3] == 0){
					button3.set({asset: "cubo1.png"});
					matriz_button[3] = 1;
				}else{
					button3.set({asset: "cubo2.png"});
					matriz_button[3] = 0;
				}
			});
			button4.on("click", function(){
				Q.audio.play("boton.mp3");
				if(matriz_button[4] == 0){
					button4.set({asset: "cubo1.png"});
					matriz_button[4] = 1;
				}else{
					button4.set({asset: "cubo2.png"});
					matriz_button[4] = 0;
				}
			});
			button5.on("click", function(){
				Q.audio.play("boton.mp3");
				if(matriz_button[5] == 0){
					button5.set({asset: "cubo1.png"});
					matriz_button[5] = 1;
				}else{
					button5.set({asset: "cubo2.png"});
					matriz_button[5] = 0;
				}
			});
			button6.on("click", function(){
				Q.audio.play("boton.mp3");
				if(matriz_button[6] == 0){
					button6.set({asset: "cubo1.png"});
					matriz_button[6] = 1;
				}else{
					button6.set({asset: "cubo2.png"});
					matriz_button[6] = 0;
				}
			});
			button7.on("click", function(){
				Q.audio.play("boton.mp3");
				if(matriz_button[7] == 0){
					button7.set({asset: "cubo1.png"});
					matriz_button[7] = 1;
				}else{
					button7.set({asset: "cubo2.png"});
					matriz_button[7] = 0;
				}
			});
			button8.on("click", function(){
				Q.audio.play("boton.mp3");
				if(matriz_button[8] == 0){
					button8.set({asset: "cubo1.png"});
					matriz_button[8] = 1;
				}else{
					button8.set({asset: "cubo2.png"});
					matriz_button[8] = 0;
				}
			});
			button9.on("click", function(){
				Q.audio.play("boton.mp3");
				if(matriz_button[9] == 0){
					button9.set({asset: "cubo1.png"});
					matriz_button[9] = 1;
				}else{
					button9.set({asset: "cubo2.png"});
					matriz_button[9] = 0;
				}
			});
			button10.on("click", function(){
				Q.audio.play("boton.mp3");
				if(matriz_button[10] == 0){
					button10.set({asset: "cubo1.png"});
					matriz_button[10] = 1;
				}else{
					button10.set({asset: "cubo2.png"});
					matriz_button[10] = 0;
				}
			});
			button11.on("click", function(){
				Q.audio.play("boton.mp3");
				if(matriz_button[11] == 0){
					button11.set({asset: "cubo1.png"});
					matriz_button[11] = 1;
				}else{
					button11.set({asset: "cubo2.png"});
					matriz_button[11] = 0;
				}
			});
			button12.on("click", function(){
				Q.audio.play("boton.mp3");
				if(matriz_button[12] == 0){
					button12.set({asset: "cubo1.png"});
					matriz_button[12] = 1;
				}else{
					button12.set({asset: "cubo2.png"});
					matriz_button[12] = 0;
				}
			});
			button13.on("click", function(){
				Q.audio.play("boton.mp3");
				if(matriz_button[13] == 0){
					button13.set({asset: "cubo1.png"});
					matriz_button[13] = 1;
				}else{
					button13.set({asset: "cubo2.png"});
					matriz_button[13] = 0;
				}
			});
			button14.on("click", function(){
				Q.audio.play("boton.mp3");
				if(matriz_button[14] == 0){
					button14.set({asset: "cubo1.png"});
					matriz_button[14] = 1;
				}else{
					button14.set({asset: "cubo2.png"});
					matriz_button[14] = 0;
				}
			});
			button15.on("click", function(){
				Q.audio.play("boton.mp3");
				if(matriz_button[15] == 0){
					button15.set({asset: "cubo1.png"});
					matriz_button[15] = 1;
				}else{
					button15.set({asset: "cubo2.png"});
					matriz_button[15] = 0;
				}
			});

			var matriz_tablero = [0,0,1,0,1,1,0,1,1,1,0,1,0,0,1,0,];
			// Poner un botón para comprobar el mosaico
			var comprobar_button = new Q.UI.Button({x: 390, y: 260, w: 441, h: 128, scale: 0.4, asset: "comprobar.png"});	
			stage.insert(comprobar_button);
			comprobar_button.on("click", comprobar);

			// Comprobamos si es correcto el código
			function comprobar(){
				let flag = false;
				let i = 0;
				while((i < 16) && (flag == false)){
					if(matriz_tablero[i] != matriz_button[i])
						flag = true;
					i++;
				}

				if(!flag){
					console.log("Equals");
					var passed = new Q.UI.Button({x: 501, y: 175, w: 240, h: 60, scale: 0.70, asset: "passed.png"});
					stage.insert(passed);
					Q.stageScene("mapa4", 1);
				}else{
					console.log("Not equals");
					Q.state.get("vidas");
					Q.state.dec("vidas", 1);
					if(Q.state.get("vidas") == 0){
						Q.clearStages();
						Q.stageScene("endGame",1);
					}
				}
			}
		});

//--------------------------------CONFIGURACIÓN-------------------------------------------------//	 
		//Creamos una escena para que muestre las vidas en el nivel frutas
		Q.scene("hud", function(stage){
			label_vidas = new Q.UI.Text({x:60, y:0, label: "vidas: 3", color: "#FFFFFF"});
			stage.insert(label_vidas);

			//Registrar un evento de cambio de vidas	
			//Utilizamos la funcion anonima
			Q.state.on("change.vidas", this, function(){
				label_vidas.p.label = "vidas: "+Q.state.get("vidas");
			})
		});
		
		//Creamos la escena principal
		Q.scene("mainTitle", function(stage){
			// Iniciamos las variables globales de contadores
			Q.state.reset({ vidas: 3,  frutas: 0});

			// Creamos el botón de inicio
			var button = new Q.UI.Button({
				x: Q.width/2,
				y: Q.height/2,
				w: 800, 
				h: 300,
				scale: 1.01,
				asset: "titulo.png"
			});
			stage.insert(button);

			// PARA QUE SEA COMPATIBLE CON MOBILE
			/*
			addEventListener("keydown", function(){
				Q.clearStages();
				
				Q.stageScene("tutorial0", 1);
				Q.stageScene("hud", 2);
			});*/

			// Creamos el inicio
			button.on("click", function(){
				Q.clearStages();
				
				Q.stageScene("tutorial0", 1);
				Q.stageScene("hud", 2);
			});
		});

	   	Q.scene('endGame',function(stage) {
			var button2 = new Q.UI.Button({x: Q.width/2, y: Q.height/2, w: 605, h: 259, scale: 1, asset: "endGame.png"});
			stage.insert(button2);

			// Cuando se hace click se limpian los escenarios y se reinicia el juego
			button2.on("click",function() {
				Q.clearStages();
				Q.stageScene('mainTitle');
			});
		});

		Q.scene('win',function(stage) {
			var button2 = new Q.UI.Button({x: Q.width/2, y: Q.height/2, w: 605, h: 259, scale: 1, asset: "win.png"});
			stage.insert(button2);

			// Cuando se hace click se limpian los escenarios y se reinicia el juego
			button2.on("click",function() {
				Q.clearStages();
				Q.stageScene('mainTitle');
			});
		});

		//Q.debug = true;
		//Q.debugFill = true;
	   	Q.stageScene("mainTitle");
	});
}