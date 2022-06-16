/*
	TFG - EFRAIN FERNANDEZ 
	VIDEOJUEGO EDUCATIVO
*/

var game = function(){

	//----------------------------------------------------------------------//
	//------------------------Se inicializa el motor------------------------//
	//----------------------------------------------------------------------//

	/*
		Se crea una instancia de la ingeniería Quintus
		e incluimos los Sprites, Scenes, Input y 2D modulo.
		El módulo 2D include la clase 'TileLayer' además
		del componente 2D
	*/
	var Q = window.Q = Quintus()
		.include(["Sprites", "Scenes", "Input", "2D", "UI", "Anim", "TMX", "Audio", "Touch"])
		.setup("myGame",
		{
			width: 800,
			height: 600,
			scaleToFit: true	//Para que reescale
		})
		.controls().enableSound().touch();

	//----------------------------------------------------------------------//
	//-------------------------Se definen las entidades---------------------//
	//----------------------------------------------------------------------//

	//----------------------------------------------------------------------//
	//----------------Carga de recursos e inicio del juego------------------//
	//----------------------------------------------------------------------//

	// Se cargan todos los los recursos
	Q.load(["tiles.png", "tiles.tsx", "mapa.tmx", "background.png"], function() {
	
		// Se compilan los sheets con sus respectivos json
		//Q.compileSheets("mario_small.png","mario_small.json");

		//Se crean las diferentes animaciones
		/*
		Q.animations("mario_anim",{
			walk_right: {frames: [1,2,3], rate: 1/6, next: "parado_r"},
			walk_left: {frames: [15,16,17], rate: 1/6, next: "parado_l"},
			jump_right: {frames: [4], rate: 1/6, next: "parado_r"},
			jump_left: {frames: [18], rate: 1/6, next: "parado_l"},
			fall_right: {frames: [6,7], rate: 1/6, next: "parado_r"},
			fall_left: {frames: [20,21], rate: 1/6, next: "parado_l"},
			parado_r: {frames: [0] },
			parado_l: {frames: [14] },
			morir: {frames: [12], loop:false, rate:1}
		});

		Q.animations("character_anim",{
			walk_right: {frames: [1,2,3], rate: 1/6, next: "parado_r"},
			walk_left: {frames: [15,16,17], rate: 1/6, next: "parado_l"},
			jump_right: {frames: [4], rate: 1/6, next: "parado_r"},
			jump_left: {frames: [18], rate: 1/6, next: "parado_l"},
			fall_right: {frames: [6,7], rate: 1/6, next: "parado_r"},
			fall_left: {frames: [20,21], rate: 1/6, next: "parado_l"},
			parado_r: {frames: [0] },
			parado_l: {frames: [14] },
			morir: {frames: [12], loop:false, rate:1}
		});*/


		//----------------------------------------------------------------------//
		//-------------------------Se definen las escenas-----------------------//
		//----------------------------------------------------------------------//
		Q.scene("level1", function(stage) {

			console.log("Llegamos");
			Q.stageTMX("map.tmx", stage);
			stage.add("viewport");

			/*
			mario = new Q.Mario();
			stage.insert(mario);
			
			stage.add("viewport").follow(mario,{x:true, y:false});
			
			stage.viewport.scale = .75;
			stage.viewport.offsetX = -200;
			stage.on("destroy",function() {
				mario.destroy();
			});*/

			/*		Para insertar enemigos

			stage.insert(new Q.Goomba());
			stage.insert(new Q.Goomba());
			stage.insert(new Q.Goomba());
			
			*/

			//Iniciamos variables globales
			//Q.state.reset({lives: 2});

			//Iniciamos la música de fondo
			/*
			Q.audio.play("music_main.mp3", {loop:true});*/
			});
		

		//----------------------------------------------------------------------//
		//-------------------------Se llaman a las escenas----------------------//
		//----------------------------------------------------------------------//
		Q.stageScene("level1", 1);	// El 1 significa la prioridad en las capas de la pantalla
		
	});
	
}