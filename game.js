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
				scale: 1,
				taken: false
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

			// Entrada al minijuego de secuenciacion 
			if (this.p.x > 800  && this.stage.scene.name == "mapa1") {
				this.stage.add("viewport").follow(main,{x:false, y:false});
				if(this.p.x > 1400){
					Q.stageScene("tutorial1", 1);
				}
			}

			// Entrada al minijuego de modulacion
			if (this.p.x > 800 && this.stage.scene.name == "mapa2") {
				this.stage.add("viewport").follow(main,{x:false, y:false});
				if(this.p.x > 1400){
					Q.stageScene("tutorial2", 1);
				}
			}

			// Entrada al nivel 2
			if (this.p.x > 1650 && this.stage.scene.name == "mapa4" && Q.state.get("level") == 1) {
				if(this.taken) return;		//Para utilizar la colisión una sola vez 
				this.stage.add("viewport").follow(main,{x:false, y:false});
				this.p.vx = 0;

				if(this.p.x <= 1700 && this.p.x >= 1500){
					this.taken = true;
					var mon = new Q.Mon();
					this.stage.insert(mon);
				}
			}

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
				x: 1760,
				y: 220,
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
			// Para salir del mapa4
			if (this.p.x > 2270 && this.stage.scene.name == "mapa4") {
				this.destroy();
				// Se aumenta de nivel
				Q.state.get("level");
				Q.state.inc("level", 1);

				Q.stageScene("tutorial4", 1);
			}
			if(this.p.vx > 0){	//Si se mueve a la derecha
	    		this.play("walk_right_mon");
	    	}else if(this.p.vx < 0){
	    		this.play("walk_left_mon");
	    	}
		},
		find: function(collision){
			if(this.taken) return;		//Para utilizar la colisión una sola vez 

	    	if(!collision.obj.isA("Main"))		return;	//Para que solo colisione con Main
	    	
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
				if(this.taken) return;		//Para solo usar la colisión una vez por objeto

				Q.audio.play("error.mp3");
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
			if(collision.obj.isA("Caja")){
				if(this.taken) return;		//Para solo usar la colisión una vez por objeto

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
	

//--------------------------------CARGA DE ELEMENTOS-------------------------------------------//	 
	Q.load(["error.mp3", "controles__tutorialbarra.png", "win.png", "titulo.png", "endGame.png", "mon.png", "mon.json", "soundtrack_sequence.mp3", "soundtrack_portada.mp3", "soundtrack_mapa123.mp3", "soundtrack_mapa4.mp3", "soundtrack_frutas.mp3", "soundtrack_copy.mp3", "boton.mp3", "fruta.mp3", "salto.mp3", "pasos.mp3", "puerta.mp3", "controles__tutorialbarra.png", "tutorial__0.png", "tutorial__1.png", "tutorial__2.png", "tutorial__3.png", "tutorial__4.png", "controles__tutorial1.png", "controles__tutorial2.png", "controles__tutorial3.png", "controles__tutorialbarra.png", "arbol.png", "arbol.json", "puerta.png", "puerta.json", "background_copy.png", "map_copy.tmx", "background_fruit.png", "map_fruit.tmx", "mapa2.tmx", "mapa3.tmx", "mapa4.tmx", "degradado1.png", "degradado3.png","degradado4.png","degradado5.png", "tiles.tsx", "tiles.png", "mapa1.tmx", "suelo.json", "suelo.png", "frutas_selected.json", "frutas_selected.png", "comprobar.png", "cubo2.png", "cubo2.json", "cubo1.png", "cubo1.json", "main2.png", "main2.json", "flecha.png", "flecha.json", "cube2.png", "cube2.json", "cube1.png", "cube1.json", "sequence.tmx", "frutas.png", "frutas.json", "caja.json", "caja.png", "main.json", "main.png"], function() {
	 
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
			walk_right_mon: {frames: [0,1], rate: 1/6},
			walk_left_mon: {frames: [2,3], rate: 1/6}
		});
//--------------------------------MAPA PRINCIPAL-------------------------------------------------//	  
		//--------------------------------------------------------------//
		//--------------------------MAPA1-------------------------------//
		//--------------------------------------------------------------//
	   	Q.scene("mapa1", function(stage) {
			if(Q.state.get("level") == 1)
				Q.stageScene("hud", 2);
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

			//Iniciamos la música
			Q.audio.stop(); 
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

			if(Q.state.get("level") == 2){
				var mon2 = new Q.Mon({x: 1100, y: 100});
				stage.insert(mon2);
			}

			stage.add("viewport").follow(main,{x:true, y:false});
			stage.viewport.scale = 1;
			stage.viewport.offsetX = -200;

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
			button = new Q.UI.Button({x: Q.width/2, y: Q.height/2, w: 605, h: 259, scale: 1, asset: "controles__tutorialbarra.png"});
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

		//--------------------------------------------------------------//
		//--------------------------TUTORIAL4---------------------------//
		//--------------------------------------------------------------//
		Q.scene("tutorial4", function(stage) {
			button = new Q.UI.Button({x: Q.width/2, y: Q.height/2, w: 605, h: 259, scale: 1, asset: "tutorial__4.png"});
			stage.insert(button);

			// Creamos el evento click para el botón
			button.on("click", function(){
				Q.stageScene("mapa1", 1);
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

			//-------------Definición de variables-----------------//

			// Para realizar la secuencia de teclas
			// Bucle for de 5 iteraciones, cambiando las coordenadas de x
			// Establecemos un codigo dependiendo de la secuencia, y se comprueba si se cumple ese codigo
			var counter;

			// Coordenadas de cada punto del tablero (el tablero será una matriz de coordenadas)
			var coordinates = [];

			// Movimiento del personaje -> Contendrá las coordenadas por las que 
			// pasará nuestro personaje para intentar pasar el nivel
			var mov = [];

			// Creamos un array para ir guardando el código que vamos conformando
			// Este codigo se compondrá de un codigo creado según los movimientos de las flechas
			var code = [];
			
			// main_coord será el array que contendrá las coordenadas exactas de la casilla correspondiente
			var main_coord, main2;
			
			// Creamos la variable para el setInterval posterior para reproducir el movimiento
			var interval_movimiento;

			// Creamos una variable por si nos salimos del tablero
			var fuera;

			var contador_movimiento = 0;

			//----------Funciones del desarrollo del nivel--------//
			/*
			 * Function: inicializacion
			 * Params: 
			 * Usage: Inicializa el array que contiene las coordenadas de las casillas
			 */
			function inicializacion(){
				// Este contador servirá para numerar cada casilla del tablero
				var cont = 0;

				for(let i = 0; i < 4; i++){
					for(let j = 0; j < 4; j++){

						// Creamos las diferentes coordenadas del tablero

						// Los indices están al revés ya que las columnas son la coord x
						new_x = 450 + 50*j;
						new_y = 100 + 50*i;
						// Rellenamos la matriz de coordenadas
						coordinates[cont] = [new_x, new_y];

						// Incrementamos el contador
						cont++;
					}
				}

			}

			/*
			 * Function: imprime_tablero
			 * Params: array
			 * Usage: Dibuja el tablero según el array que tiene como parámetro
			 */
			function imprime_tablero(array){
				for(let i = 0; i < 16; i++){
					// Ponemos las condiciones para pintar el tablero
					if(array[i] == 1){
						// Elegimos según el array que pasamos como nivel para pintar baldosas amarillas
						cube2 = new Q.Cube2({x: coordinates[i][0], y: coordinates[i][1]});
						stage.insert(cube2);
					}else{
						// El resto de cubos serán cubos de tipo "pared"
						cube1 = new Q.Cube1({x: coordinates[i][0], y: coordinates[i][1]});
						stage.insert(cube1);
					}
				}
			}

			/*
			 * Function: inicio_sequence
			 * Params: 
			 * Usage: Inicia las variables para una nueva secuencia
			 */
			function inicio_sequence(coordenada_inicio){
				// Se inicia la variable counter (lleva las cuentas de cada iteracion)
				counter = 0;

				mov = [];
				code = [];
				main_coord = [];
				for(let i = 0; i < 4; i++){
					mov[i] = 0;
					code[i] = 0;
				}

				// Guardamos la primera coordenada en la que está el personaje
				mov[0] = coordenada_inicio;
				coordenada = coordenada_inicio; 

				// main_coord será el array que contendrá las coordenadas exactas de la casilla correspondiente
				main_coord = coordinates[coordenada_inicio];

				// Dibujamos al personaje en la casilla inicial
				main2 = new Q.Main2({x: main_coord[0], y: main_coord[1]});
				stage.insert(main2);

				fuera = 0;

				// Activamos el evento keydown
				addEventListener("keydown", evento_teclas);
			}

			/*
			 * Function: evento_teclas
			 * Params: e
			 * Usage: Manejador del evento keydown para la pulsación de las flechas
			 */
			function evento_teclas(e){
				// Para crear la secuencia visualmente se mueven las coordenadas de dibujado de la flecha
				switch(counter){
					case 0:	x_new = 375; break;
					case 1:	x_new = 475; break;
					case 2:	x_new = 575; break;
					case 3:	x_new = 675; break;
				}

				if(e.keyCode == 37){
					// CODIGO 1 - IZQUIERDA
					if(coordenada == 0 || coordenada == 4 || coordenada == 8 || coordenada == 12){
						fuera = 1;
					}else{
						code[counter] = 1;

						flecha = new Q.Flecha({sheet: "flecha2", x: x_new});
						stage.insert(flecha);
	
						// Cambiamos el índice del tablero donde iría el personaje si todo es correcto
						coordenada -= 1;
						mov[counter] = coordenada;
					}
					// Aumentamos el contador
					counter++;
				}
				else if(e.keyCode == 38){
					// CODIGO 2 - ARRIBA
					if(coordenada == 0 || coordenada == 1 || coordenada == 2 || coordenada == 3){
						fuera = 1;
					}else{
						code[counter] = 2;

						flecha = new Q.Flecha({sheet: "flecha3", x: x_new});
						stage.insert(flecha);

						coordenada -= 4;
						mov[counter] = coordenada;
					}
					// Aumentamos el contador
					counter++;
				}
				else if(e.keyCode == 39){
					// CODIGO 3 - DERECHA
					if(coordenada == 3 || coordenada == 7 || coordenada == 11 || coordenada == 15){
						fuera = 1;
					}else{
						code[counter] = 3;
						flecha = new Q.Flecha({sheet: "flecha1", x: x_new});
						stage.insert(flecha);

						coordenada += 1;
						mov[counter] = coordenada;
					}
					// Aumentamos el contador
					counter++;
				}
				else if(e.keyCode == 40){
					// CODIGO 4 - ABAJO
					if(coordenada == 12 || coordenada == 13 || coordenada == 14 || coordenada == 15){
						fuera = 1;
					}else{
						code[counter] = 4;
						flecha = new Q.Flecha({sheet: "flecha4", x: x_new});
						stage.insert(flecha);

						coordenada += 4;
						mov[counter] = coordenada;
					}
					// Aumentamos el contador
					counter++;
				}

				// Se comprueba si la secuencia es correcta
				if(counter == 4 || fuera == 1){
					comprueba();
				}
			}

			/*
			 * Function: comprueba
			 * Params: 
			 * Usage: Se comprueba si la secuencia es correcta
			 */
			function comprueba(){
				// No se permiten más movimientos
				removeEventListener("keydown", evento_teclas, function(){});

				if(fuera == 1){
					reinicio();
				}else{
					// Convertimos el codigo a un numero para comprobar su validez junto con el código válido
					final_code = code[0]*1000 + code[1]*100 + code[2]*10 + code[3];

					if(final_code == codigo_final){
						// Se llama a la función movimiento que recorre el array de coordenadas
						interval_movimiento = setInterval(movimiento, 750, true);

						// Para realizar la animación del final del movimiento y poner fuera el personaje
						setTimeout(function(){
							main_coord = coordinates[16];
							main2.set({x: main_coord[0], y: main_coord[1]});
						}, 5000);
						
					// Se hace la animación pero no es correcta
					}else{
						// Llamamos a la función que realiza el movimiento y reinicia
						interval_movimiento = setInterval(movimiento, 750, false);
					}
				}
			}

			/*
			 * Function: movimiento
			 * Params: arg (indica si la secuencia es correcta o no)
			 * Usage: Creamos la función movimiento para que el 
			 * 		  personaje realice el recorrido tras la secuencia
			 */
			function movimiento(arg){
				coordenada = mov[contador_movimiento];
				main_coord = coordinates[coordenada];
				contador_movimiento++;

				// Si se sale del mapa se comprueba
				if(contador_movimiento == 5){
					if(arg){
						// Si es correcto el movimiento
						clearInterval(interval_movimiento);

						setTimeout(function(){ 
							Q.stageScene("mapa2", 1);
						}, 500);
					}else{
						// Si es incorrecto
						clearInterval(interval_movimiento);
						reinicio();
					}
					
				}else{
					// Se dibuja al personaje
					main2.set({x: main_coord[0], y: main_coord[1]});
				}
			}

			/*
			 * Function: reinicio
			 * Params: 
			 * Usage: Se utiliza para reiniciar el nivel en caso de fallo
			 */
			function reinicio(){
				Q.state.get("vidas");
				Q.state.dec("vidas", 1);

				if(Q.state.get("vidas") == 0){
					Q.clearStages();
					Q.stageScene("endGame");
				}else{
					Q.stageScene("sequence_level", 1);
				}
				
			}
			
			//------------Ejecución--------------//
			
			// Se elige el nivel en el que se está
			level = Q.state.get("level");
			if(level == 1){
				level_array =[
					0,0,1,0,
					0,1,1,0,
					0,1,0,0,
					0,1,0,0];
				coordenada_inicio_level = 13;
				codigo_level = 2232;

			}else if(level == 2){
				level_array =[
					0,0,0,0,
					1,1,1,0,
					0,0,1,0,
					0,0,1,0];
				coordenada_inicio_level = 4;
				codigo_level = 3344;
			}

			// Codigo correcto para pasar el nivel -> Se comparará con la variable code
			var codigo_final = codigo_level;

			inicializacion();
			imprime_tablero(level_array);
			inicio_sequence(coordenada_inicio_level);
			// Se realiza la secuencia gracias al evento keydown

			// Añadimos una coordenada de fuera
			coordinates[16] = [750, 175];
		});

		//--------------------------------------------------------------//
		//--------------------------FRUTAS------------------------------//
		//--------------------------------------------------------------//
		Q.scene("fruit_level", function(stage) {
			// Añadimos la música al escenario, en bucle
			Q.audio.stop(); 
			Q.audio.play("soundtrack_frutas.mp3", {loop:true});

			Q.state.get("frutas");
			Q.state.set({frutas: 0});

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

			/*
			 * Function: random_numer
			 * Params: min, max
			 * Usage: Funcion para obtener un numero random entre dos numeros
			 */
			function random_numer(min,max){
				return parseInt(Math.random()*(max-min)) + min;
			}

			// Y otra que haga que caigan las frutas que queremos
			/*
			 * Function: frutas_caen
			 * Params: 
			 * Usage: Funcion generar las frutas aleatorias
			 */
			function frutas_caen(){
				// Generamos un nº aleatorio para que vayan cayendo distintas frutas irrelevantes
				fruta_sheet = random_numer(1,10);
				// Creamos cada fruta
				fruta = new Q.Fruta({sheet: fruta_sheet});
				
				stage.insert(fruta);
			}

			/*
			 * Function: frutas_selected_caen
			 * Params: 
			 * Usage: Funcion generar las frutas aleatorias que deben ser recogidas
			 */
			function frutas_selected_caen(){
				fruta_sheet = random_numer(10,14);
				// Creamos cada fruta
				frutas_selected = new Q.Frutas_selected({sheet: fruta_sheet});
				
				stage.insert(frutas_selected);
			}

			// Añadimos los setInterval para que las frutas caigan periodicamente
			
			// Se elige el nivel en el que se está
			level = Q.state.get("level");
			if(level == 1){
				setInterval(frutas_caen, 1000);
				setInterval(frutas_selected_caen, 3000);

			}else if(level == 2){
				setInterval(frutas_caen, 200);
				setInterval(frutas_selected_caen, 1000);
			}
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

			//--------------Definición de variables----------//
			// Matriz de encendido/apagado por boton
			var matriz_button = [];

			// Matriz de objetos button
			var button = [];
			var button_copia = [];

			/*
			 * Function: getRandomInt
			 * Params: max
			 * Usage: Devuelve un nº que es 1 o 0.
			 */
			function getRandomInt(max) {
				return Math.floor(Math.random() * max);
			}
			// Matriz de creación de códigos
			var matriz_tablero = [];
			for(let i = 0; i < 16; i++)
				matriz_tablero[i] = getRandomInt(2);

			//contador para el bucle
			var counter = 0;
			for(let i = 0; i < 4; i++){
				for(let j = 0; j < 4; j++){
					new_x = 313 + 50*j;
					new_y = 50 + 50*i;

					// Creamos el array de botones interactivp
					button[counter] = new Q.UI.Button({x: new_x, y: new_y, w: 75, h: 75, scale: 0.60, asset: "cubo2.png"});
					button_use = button[counter];
					matriz_button[counter] = 0;
					stage.insert(button_use);

					// Dibujamos el patrón del que habrá que hacer la copia
					little_x = 625 + 25*j;
					little_y = 112 + 25*i;
					if(matriz_tablero[counter] == 0){
						button_copia[counter] =  new Q.UI.Button({x: little_x, y: little_y, w: 75, h: 75, scale: 0.30, asset: "cubo2.png"});
					}else{
						button_copia[counter] =  new Q.UI.Button({x: little_x, y: little_y, w: 75, h: 75, scale: 0.30, asset: "cubo1.png"});
					}
					b_copia = button_copia[counter];
					stage.insert(b_copia);

					counter++;
				}
			}

			// Poner un botón para comprobar el mosaico
			var comprobar_button = new Q.UI.Button({x: 390, y: 260, w: 441, h: 128, scale: 0.4, asset: "comprobar.png"});	
			stage.insert(comprobar_button);
			comprobar_button.on("click", comprobar);

			/*
			 * Function: comprobar
			 * Params: 
			 * Usage: Comprobamos si es correcto el código
			 */
			function comprobar(){
				let flag = false;
				let i = 0;
				while((i < 16) && (flag == false)){
					if(matriz_tablero[i] != matriz_button[i])
						flag = true;
					i++;
				}

				if(!flag){
					Q.stageScene("mapa4", 1);
				}else{
					Q.state.get("vidas");
					Q.state.dec("vidas", 1);
					if(Q.state.get("vidas") == 0){
						Q.clearStages();
						Q.stageScene("endGame",1);
					}
				}
			}

			// Creamos el evento click para cada botón
			button0 = button[0];
			button1 = button[1];
			button2 = button[2];
			button3 = button[3];
			button4 = button[4];
			button5 = button[5];
			button6 = button[6];
			button7 = button[7];
			button8 = button[8];
			button9 = button[9];
			button10 = button[10];
			button11 = button[11];
			button12 = button[12];
			button13 = button[13];
			button14 = button[14];
			button15 = button[15];

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
			Q.state.reset({ vidas: 3,  frutas: 0, level: 1});
			
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

			// Creamos el inicio
			button.on("click", function(){
				Q.clearStages();
				
				Q.stageScene("tutorial0", 1);
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

			Q.audio.stop();
			Q.audio.play("soundtrack_portada.mp3");
			// Cuando se hace click se limpian los escenarios y se reinicia el juego
			button2.on("click",function() {
				Q.clearStages();
				Q.stageScene('mainTitle');
			});
		});

		Q.stageScene("mainTitle");
	});
}