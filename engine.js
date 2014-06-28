var config = {};
var $2 = {};

$(document).ready(function() {
	FileRead('config.js', function(raw)
	{
		config = JSON.parse(raw); 
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

				if(config['showLoadProcess'])
					console.log('all load complete!');

				clearInterval(timer); 
				$2.OnLoadComplete();
				$2.StartLoop();
			}); 
	}); 
});
