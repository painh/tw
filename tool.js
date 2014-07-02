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

				$2.StartLoop();
			}); 
	}); 

	$("#btnLoad").click(function() { 
		var filename = $("#inpFilename").val();
		$2.Map.Load(filename, function(map)
					{
						$("#inpMapWidth").val(map.width);
						$("#inpMapHeight").val(map.height);
						$("#inpTileSize").val(map.tileSize);
						$("#inpTileAResKey").val(map.tileSet[0].key);
					});	

	});

	$("#btnSave").click(function() {
		var filename = $("#inpFilename").val();
		var mapWidth = $("#inpMapWidth").val();
		var mapHeight = $("#inpMapHeight").val();
		var tileSize = $("#inpTileSize").val();
		var tileSetA = $("#inpTileAResKey").val();


		$2.Map.Save({filename:filename,
					mapWidth:mapWidth,
				   mapHeight:mapHeight,
				   tileSize:tileSize,
				   tileSetA:tileSetA});	
	});

	$(".imgTileArea").click(function(e) {
		var x = parseInt(e.offsetX / $2.Map.tileSize);
		var y = parseInt(e.offsetY / $2.Map.tileSize);
		var idx = x + parseInt($(this).width() / $2.Map.tileSize) * y;
		$2.Map.SetSelectedTile(idx);
	});
});
