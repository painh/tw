var config = {};
var $2 = {};

$(document).ready(function() {
	FileRead('config.js', function(raw)
	{
		config = JSON.parse(raw); 
		$2 = new core();

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
				$2.OnLoadComplete(true);
				$2.StartLoop();
			}); 
	}); 
});
