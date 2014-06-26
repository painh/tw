var config = {};
var $2 = {};

function StartLoop() { 
    var interval = 1000 / config["fps"];
    var timer = setInterval( function() {
        $2.globalNow = new Date();

        if($2.MouseManager.prevLDown == false && $2.MouseManager.LDown )
            $2.MouseManager.Clicked = true;

        if($2.MouseManager.prevLDown == true && $2.MouseManager.LDown == false )
            $2.MouseManager.Upped = true;

//        SceneManager.Update();
		var r = $2.Renderer;
		r.SetColor(r.clearColor);
		r.Rect(0, 0, config['width'], config['height']);
		r.SetColor(r.defaultColor);
//        SceneManager.Render();

		$2.fps++;
//		r.Img(0,0,test);	
		r.Text(0, 0, "FPS : " + $2.lastFPS );
		r.frontContext.drawImage(r.backCanvas, 0, 0,
							r.width, r.height, 0, 0, r.backCanvas.width, r.backCanvas.height); 
		
		var curDate = new Date();
		$2.globalNow = curDate.getTime();

		if( $2.globalNow - $2.lastTime > 1000) {
			$2.lastFPS = $2.fps;
			$2.fps = 0;
			$2.lastTime = $2.globalNow;
		}
		
        $2.MouseManager.prevLDown = $2.MouseManager.LDown;
        $2.MouseManager.Upped = false;
        $2.MouseManager.Clicked = false;

        $2.KeyManager.EndFrame();

        ++$2.totalFPS;
    }, interval); 
}

$(document).ready(function() {
	FileRead('config.js', function(raw)
	{
		console.log(raw);
		config = JSON.parse(raw); 
		console.log(config);
		$2 = new core();


		if(config["gameDivAlign"] == "center")
			$("#game").css( { position : "absolute", top : "50%", left : "50%",  margin: "-" + (config["height"] * config["screenScale"])/ 2 + "px 0 0 -" + (config["width"] * config["screenScale"]) / 2+ "px"} );

		$(window).keydown(function(e) { 
			$2.KeyManager.KeyDown(e.keyCode);
		});

		$(window).keyup(function(e) {
			$2.KeyManager.KeyUp(e.keyCode);
		});

		document.title = config['title'];
		AllowZoom(false); 

		for(var i in config['files']) {
			var item = config['files'][i];
			$2.Loader.Load(item[0], item[1], item[2]); 
		} 
		
		var timer = setInterval( function() {
				if(!$2.Loader.AllLoadComplete())
					return;

				console.log('all load complete!');
				StartLoop();
				clearInterval(timer); 
			}); 
	});

});
