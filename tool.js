var config = {};
var $2 = {};

$(document).ready(function() {
	function Load(filename) {
		$2.Map.Load(filename, function(map) {
						$("#inpFilename").val(filename);
						$("#inpMapWidth").val(map.width);
						$("#inpMapHeight").val(map.height);
						$("#inpTileSize").val(map.tileSize);
						$("#inpTileAResKey").val(map.tileSet[0].key);
						$("#inpTileBResKey").val(map.tileSet[1].key);
					});	
	}
	
	FileRead('config.js', function(raw) {
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
				Load("map_001.js");
				$2.OnLoadComplete(false);

				$2.StartLoop();
			}); 
	}); 

	$("#btnResize").click(function() {
		var mapWidth = $("#inpMapWidth").val();
		var mapHeight = $("#inpMapHeight").val();

		$2.Map.Resize(mapWidth, mapHeight); 
	});

	$("#btnLoad").click(function() { 
		var filename = $("#inpFilename").val();
		Load(filename);
	});

	$("#btnSave").click(function() {
		var filename = $("#inpFilename").val();
		var mapWidth = $("#inpMapWidth").val();
		var mapHeight = $("#inpMapHeight").val();
		var tileSize = $("#inpTileSize").val();
		var tileSetA = $("#inpTileAResKey").val();
		var tileSetB = $("#inpTileBResKey").val();


		$2.Map.Save({filename:filename,
					mapWidth : mapWidth,
					mapHeight : mapHeight,
					tileSize : tileSize,
					tileSet : [tileSetA, tileSetB]
					});	
	});


	var tileLayerIDX = 0;

	$(".imgTileArea").click(function(e) {
		var x = parseInt(e.offsetX / $2.Map.tileSize);
		var y = parseInt(e.offsetY / $2.Map.tileSize);
		var idx = x + parseInt($(this).width() / $2.Map.tileSize) * y;
		$2.Map.SetSelectedTile(tileLayerIDX, idx);
	});

	$(".btnTileSet").click(function()
   {
	   var idx = $(this).attr('data-idx');
	   $(".divTileArea").hide();
	   var selector = ".divTileArea[data-idx='"+idx+"']"; 
	   tileLayerIDX = idx;
	   $(selector).show(); 
   });
});
