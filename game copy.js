var game = function() {

var Q = window.Q = Quintus()
		.include(["Sprites", "Scenes", "Input", "2D", "UI", "Anim", "TMX", "Audio", "Touch"])
        .setup("myGame",
        {
        	width: 800,
        	height: 600,
        	scaleToFit: true	//Para que reescale
        })
        .controls().enableSound().touch();


    //Añadir un componente para todos
    Q.component("dancer",{
    	extend: {
    		dance: function(){
    			this.p.angle = 0;
    			this.animate({angle: 360}, 0.5, Q.Easing.Quadratic.In);
    		}
    	}
    });
	Q.Sprite.extend("Character", {
	    
	    init: function(p) {
	    	this._super(p,{
	        	sheet: "character",
	        	sprite: "character_anim",
	        	x: 250,
	        	y: 250,
	        	frame: 0,
	        	scale: 1
	      	});
	      	//Añadimos gravedad y controles básicos
	      	this.add("2d, platformerControls");

	      	//Cuando se de el evento up, se llama a la funcion this
	      	Q.input.on("up", this, function(){
	      		if(this.p.vy == 0)
	      			Q.audio.play("jump_small.mp3");
	      	});

	      	//Cuando se pulse fire, baila
	      	//Q.input.on("fire", this, "dance");
	      	/*
	      	Q.input.on("left", this, function() { this.p.x -= 10; });
	      	Q.input.on("right", this, function() { this.p.x += 10; });
	      	Q.input.on("up", this, function() { this.p.y -= 10; });
	      	Q.input.on("down", this, function() { this.p.y += 10; });*/

	    },
	    step: function(dt){
	    	if(this.p.vx > 0){	//Si se mueve a la derecha
	    		this.play("walk_right");
	    	}else if(this.p.vx < 0){
	    		this.play("walk_left");
	    	}

	    	//Animacion de mario saltando
	    	if(this.p.vy < 0){	//Si salta
	    		if(this.p.vx > 0){	//Si se mueve a la derecha
	    			this.play("jump_right");
	    		}else if(this.p.vx < 0){
	    			this.play("jump_left");
	    		}
	    	}

	    	//Animacion de mario cayendo
	    	if(this.p.vy > 0){	//Si salta
	    		if(this.p.vx > 0){	//Si se mueve a la derecha
	    			this.play("fall_right");
	    		}else if(this.p.vx < 0){
	    			this.play("fall_left");
	    		}
	    	}
	    },
		die: function(){
	   		console.log("Mario dies");
	    	Q.state.dec("lives", 1);		//decrementamos las vidas
	    	console.log(Q.state.get("lives"));		//Miramos las vidas

	    	if(Q.state.get("lives")<0)
	    		collision.obj.destroy();	//Matamos a mario_small
	    		Q.stageScene("endGame", 2);
	   	}
	});

	Q.Sprite.extend("Mario", {
	    
	    init: function(p) {
	    	this._super(p,{
	        	sheet: "mario",
	        	sprite: "mario_anim",
	        	x: 250,
	        	y: 250,
	        	frame: 0,
	        	scale: 1
	      	});
	      	//Añadimos gravedad y controles básicos
	      	this.add("2d, platformerControls, animation, tween, dancer");

	      	//Cuando se de el evento up, se llama a la funcion this
	      	Q.input.on("up", this, function(){
	      		if(this.p.vy == 0)
	      			Q.audio.play("jump_small.mp3");
	      	});

	      	//Cuando se pulse fire, baila
	      	Q.input.on("fire", this, "dance");
	      	/*
	      	Q.input.on("left", this, function() { this.p.x -= 10; });
	      	Q.input.on("right", this, function() { this.p.x += 10; });
	      	Q.input.on("up", this, function() { this.p.y -= 10; });
	      	Q.input.on("down", this, function() { this.p.y += 10; });*/

	    },
	    step: function(dt){
	    	if(this.p.vx > 0){	//Si se mueve a la derecha
	    		this.play("walk_right");
	    	}else if(this.p.vx < 0){
	    		this.play("walk_left");
	    	}

	    	//Animacion de mario saltando
	    	if(this.p.vy < 0){	//Si salta
	    		if(this.p.vx > 0){	//Si se mueve a la derecha
	    			this.play("jump_right");
	    		}else if(this.p.vx < 0){
	    			this.play("jump_left");
	    		}
	    	}

	    	//Animacion de mario cayendo
	    	if(this.p.vy > 0){	//Si salta
	    		if(this.p.vx > 0){	//Si se mueve a la derecha
	    			this.play("fall_right");
	    		}else if(this.p.vx < 0){
	    			this.play("fall_left");
	    		}
	    	}
	    },
		die: function(){
	   		console.log("Mario dies");
	    	Q.state.dec("lives", 1);		//decrementamos las vidas
	    	console.log(Q.state.get("lives"));		//Miramos las vidas

	    	if(Q.state.get("lives")<0)
	    		collision.obj.destroy();	//Matamos a mario_small
	    		Q.stageScene("endGame", 2);
	   	}
	});

	Q.Sprite.extend("OneUp", {
	    init: function(p) {
	     	this._super(p,{
	        	asset: "1up.png",
	        	scale: 1,
	     		x: 20,
	     		y: -10,
	     		sensor: true,		//Para que mario atraviese la setilla
	     		taken: false		//Para que no haga tantas colisiones como fps haya
	      	});
	      	this.on("sensor", this, "hit");	//Llama a hit de este objeto
	      	this.add("tween");	//Importante para el comportamiento animate -> Añadimos mediante componentes
	    },
	    hit: function(collision){
	    	if(this.taken) return;		//Si ya está cogida sale

	    	if(!collision.isA("Mario"))		return;	//Para que solo colisione con Mario
	    	
	    	this.taken = true;
	    	Q.state.inc("lives",1);
	    	console.log(Q.state.get("lives"));
	    	collision.p.vy = -400;

	    	//Desaparece la seta
	    	
	    	this.animate({y: this.p.y-100, angle: 360},
	    				 1, 
	    				 Q.Easing.Quadratic.InOut,
	    				 {callback: function(){
						  	this.destroy();
	    				 }});
	    }
	   
	});


	Q.Sprite.extend("Goomba", {
	    
	    init: function(p) {
	    	this._super(p,{
	        	sheet: "goomba",
	        	x: 400+(Math.random()*200),
	        	y: 250,
	        	frame: 0,
	        	vx: 200		//velocidad de goomba
	      	});
	    
	    	//Añadimos gravedad y controles básicos
	      	this.add("2d, aiBounce, animation");		//Le añadimos vida propia de goomba
	      	this.on("bump.top", this, "onTop");	//Si da por arriba, llamamos al onTop de esta clase
	      	this.on("bump.botton, bump.left, bump.right", this, "kill");
	      
	      	//El obj es para tener el objeto con el que colisiona (siempre que utilicemos bump)

	    },
	    onTop: function(collision){
	    	if(!collision.obj.isA("Mario"))		return;	//Para que solo colisione con Mario
	    	collision.obj.p.vy = -400;
	    	console.log("Goomba dies");
	    	this.destroy();
	    	Q.audio.play("kill_enemy.mp3");
	    },
	    kill: function(collision){
	    	if(!collision.obj.isA("Mario"))		return;	//Para que solo colisione con Mario

	    	collision.obj.p.vy = -200;
	    	collision.obj.p.vx = collision.normalX += 600;
	    	collision.obj.p.vx +=collision.normalX += 5;
	    	collision.obj.die();
	    }
	  });


	Q.load([ "mario_small.png","mario_small.json", "1up.png", "bg.png", "mapa2021.tmx", "tiles.png", "goomba.png", "goomba.json", "music_main.mp3", "title-screen.png", "kill_enemy.mp3", "jump_small.mp3", "character.png"], function() {
	 
	  	Q.compileSheets("mario_small.png","mario_small.json");
	  	Q.compileSheets("character.png","character.json");
	  	Q.compileSheets("goomba.png","goomba.json");
	  
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
	  	});
	  
	   	Q.scene("level1", function(stage) {
		 	/*
	   		stage.insert(
	   			new Q.Repeater({asset: "bg.png", speedX: 0.5, speedY: 0.5})
	   		);
	   		*/
	   		Q.stageTMX("mapa2021.tmx", stage);

		 	mario = new Q.Mario();
		 	stage.insert(mario);
		 	//stage.insert(new Q.OneUp(), mario);
		 	 
		 	stage.add("viewport").follow(mario,{x:true, y:false});
		 	stage.viewport.scale = .75;
		 	stage.viewport.offsetX = -200;
		    stage.on("destroy",function() {
		        mario.destroy();
		    });

		    stage.insert(new Q.Goomba());
		    stage.insert(new Q.Goomba());
		    stage.insert(new Q.Goomba());

		    //Iniciamos variables globales
		    Q.state.reset({lives: 2});

		    //Iniciamos la música
		    Q.audio.play("music_main.mp3", {loop:true});
	   	});

	   	//Creamos una escena para que muestre las vidas
	   	Q.scene("hud", function(stage){
	   		label_lives = new Q.UI.Text({x:50, y:0, label: "lives 2"});
	   		stage.insert(label_lives);

	   		//Registrar un evento de cambio de vidas	
	   		//Utilizamos la funcion anonima
	   		Q.state.on("change.lives", this, function(){
	   			label_lives.p.label = "lives: "+Q.state.get("lives");
	   		})
	   	});


	   	//Creamos la escena principal
	   	Q.scene("mainTitle", function(stage){
	   		var button = new Q.UI.Button({
	   			x: Q.width/2,
	   			y: Q.height/2,
	   			w: Q.width, 
	   			h: Q.height,
	   			asset: "title-screen.png"
	   		});
	   		stage.insert(button);
	   		button.on("click", function(){
	   			Q.clearStages();
	   			Q.stageScene("level1", 1);
	   			Q.stageScene("hud", 2);
	   		});
	   	});

	   	Q.scene('endGame',function(stage) {
			var container = stage.insert(new Q.UI.Container({
				x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
			}));

			var button2 = container.insert(new Q.UI.Button({
				x: 0, y: 0, fill: "#CCCCCC", label: "Play Again"
			}));

			var label = container.insert(new Q.UI.Text({
				x:10, y: -10 - button2.p.h, label: "You Lose!"
			}));

			// When the button is clicked, clear all the stages
			// and restart the game.
			button2.on("click",function() {
				Q.clearStages();
				Q.stageScene('mainTitle');
			});

			// Expand the container to visibly fit it's contents
			// (with a padding of 20 pixels)
			container.fit(20);
		});

		
	   	Q.stageScene("mainTitle");
	   	

	   	//Mientras no funciona el button
	   	/*
	   	Q.clearStages();
	   	Q.stageScene("level1", 1);
	   	Q.stageScene("hud", 2);*/
	});
}