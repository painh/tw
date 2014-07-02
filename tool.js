var config = {};
var $2 = {};

$(document).ready(function() {
	FileRead('config.js', function(raw)
	{
		config = JSON.parse(raw); 
		$2 = new core(true);

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
				$2.OnLoadComplete(false);

				$2.Map.SetMapSize(100, 100);
				$2.Map.SetTileSize(32);
				$2.Map.SetTileSet(['tilesetA']);

				$2.StartLoop();
			}); 
	}); 

	$("#btnLoad").click(function() {
		$2.Map.Load();	
	});

	$("#btnLoad").click(function() {
		var filename = $("#inpFilename").val();
		$2.Map.Save(filename);	
	});

	$(".imgTileArea").click(function(e) {
		var x = parseInt(e.offsetX / $2.Map.tileSize);
		var y = parseInt(e.offsetY / $2.Map.tileSize);
		var idx = x + parseInt($(this).width() / $2.Map.tileSize) * y;
		$2.Map.SetSelectedTile(idx);
	});
});
