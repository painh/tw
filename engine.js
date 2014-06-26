var KEY_UP = 38;
var KEY_DOWN = 40;
var KEY_LEFT = 37;
var KEY_RIGHT = 39;

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//http://stackoverflow.com/questions/2750028/enable-disable-zoom-on-iphone-safari-with-javascript

function AllowZoom(flag) {
	if (flag == true) {
		$('head meta[name=viewport]').remove();
		$('head').prepend('<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=10.0, minimum-scale=1, user-scalable=1" />');
	} else {
		$('head meta[name=viewport]').remove();
		$('head').prepend('<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=0" />');
	}
}

function ajaxReq(url, arg, successFunc, type)
{
    if(typeof(arg) == "function" && successFunc == undefined)
    {
        successFunc = arg;
        arg = {}
    }

    if(!type)
        type = 'POST';

    return $.ajax({url: url,
            type: type,
            data: arg,
            dataType: 'json',
            timeout: 1000 * 60,
            error: function (xhr, ajaxOptions, thrownError)
            {
                alert("url : " + url + "\n" + xhr.responseText);
                alert(thrownError);
            },
            success: function(json)
                        {
                            console.log("ajax req success");
                            console.log("url : " + url);
                            console.log("arg : ");
                            console.log(arg);
//                          console.log("successFunc : " + successFunc);

                            if(json)
                            {
                                console.log("json : ");
                                console.log(json);

                                if(json.error || json.failed || (json.result && json.result != 0) )
                                {
                                    var message = "";

                                    for(var i in json)
                                        message += i + " : " + json[i] + "<br>";

                                    $.growl(message);
                                }
                            }

                            if(successFunc)
                                successFunc(json)
                        }
        })
}

function FileRead(filename, func)
{
	ajaxReq('file_read.php', {filename:filename}, function(json)
	{
		func(json);
	});
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds)
      break;
  }
}

var $2 = new function() {
		this.ArgumentList = [];

		this.lastTime = new Date().getTime();
		this.fps = 0;
		this.lastFPS = 0;
		this.fps = 0;
		this.totalFPS = 0;
		this.globalNow = new Date();

		this.RandomRange = function(n1, n2) {
				return Math.floor( (Math.random() * (parseInt(n2) - parseInt(n1) + 1)) + parseInt(n1) );
		};

		this.removeFromList = function (list, obj) {
				var idx = list.indexOf(obj);
				list.splice(idx, 1);
		};


	this.KeyManager = new function() {
		this.keyMap = new Array(255);
		this.KeyMapPrevFrame = new Array(255);

		this.arrowLeft = 37;
		this.arrowUp = 38;
		this.arrowRight = 39;
		this.arrowDown = 40;

		this._1 = 49
		this._2 = 50
		this._3 = 51
		this._4 = 52

		this.a = 65;
		this.s = 83;
		this.d = 68;
		this.f = 70;
		this.z = 90
		this.x = 88

		this.space = 32;

		for( var i = 0; i < 255; ++i) {
			this.KeyMapPrevFrame[i] = false;
			this.keyMap[i] = false;
		}

		this.KeyDown = function(keyCode) {
			if(keyCode >= 255)
				return;

			this.keyMap[keyCode] = true;
		}

		this.KeyUp = function(keyCode) {
			if(keyCode >= 255)
				return;

			this.keyMap[keyCode] = false;
		}

		this.IsKeyPress = function(keyCode) {
			if(keyCode >= 255)
				return false;

			if(( this.KeyMapPrevFrame[keyCode] == false ) && (this.keyMap[keyCode] == true) )
				return true;

			return false;
		};

		this.IsKeyDown = function(keyCode) {
			if(keyCode >= 255)
				return false;

			return this.keyMap[keyCode];
		};

		this.EndFrame = function() {
			for( var i = 0; i < 255; ++i)
				this.KeyMapPrevFrame[i] = this.keyMap[i];
		};
	};

	this.MouseManager = new function() {
		this.x = 0;
		this.y = 0;
		this.LDown = false;
		this.prevLDown = false;
		this.Clicked = false;
		this.Upped = false;


        this.mouseDown = function(e) {
            e.preventDefault();

            var pageX, pageY;
            if(e.type.indexOf("touch") == 0) {
                pageX = e.originalEvent.touches[0].pageX;
                pageY = e.originalEvent.touches[0].pageY;
            }
            else {
                pageX = e.pageX;
                pageY = e.pageY;
            }

            var offsetX = $("#game").offset().left;
            var offsetY = $("#game").offset().top;
            this.x = Math.floor((pageX - offsetX) / config["screenScale"]);
            this.y = Math.floor((pageY - offsetY) / config["screenScale"]);

            this.LDown = true;
            return false;
        }

        this.mouseMove = function(e) {
            e.preventDefault();

            var pageX, pageY;
            if(e.type.indexOf("touch") == 0) {
                pageX = e.originalEvent.touches[0].pageX;
                pageY = e.originalEvent.touches[0].pageY;
            }
            else {
                pageX = e.pageX;
                pageY = e.pageY;
            }

            var offsetX = $("#game").offset().left;
            var offsetY = $("#game").offset().top;
            this.x = Math.floor((pageX - offsetX) / config["screenScale"]);
            this.y = Math.floor((pageY - offsetY) / config["screenScale"]);
            return false; 
        }

        this.mouseUp = function(e) {
            e.preventDefault();

            this.LDown = false;
            return false;
        }

        $(document).bind("touchstart mousedown", this.mouseDown);
        $(document).bind("touchmove mousemove", this.mouseMove);
        $(document).bind("touchend mouseup", this.mouseUp);
	}();

	this.GetArgument = function() {
		var fullArg = String(window.location).split('?');
		if (fullArg.length != 2)
			return;
		var args = String(fullArg[1]).split('&');

		for (var idx in args) {
			var arg = args[idx].split('=');
			if (arg.length != 2)
				continue;

			g_argumentList[ arg[0] ] = arg[1];
		}
	};

	this.Renderer = new function() {
		width = config['width'];
		height = config['height'];
		scale = config['screenScale'];
		this.canvas = $("#mainCanvas").get(0);
		this.frontContext = this.canvas.getContext('2d'); 
		this.backCanvas = $("#backCanvas").get(0);

		this.width = width;
		this.height = height;
		this.backCanvas.width = width * scale;
		this.backCanvas.height = height * scale;
		this.canvas.width = width * scale;
		this.canvas.height = height * scale;

		this.context = this.backCanvas.getContext('2d');
		this.context.font         = '13pt Arial';
		this.context.textBaseline = 'top';
		this.fontSize = parseInt($("#mainCanvas").css('font-size'));

		this.clearColor = "#000000";
		this.defaultColor = "#ffffff"; 

		this.SetAlpha = function( a ) {
			this.context.globalAlpha = a;
		}

		this.SetFont = function(font) {
			this.context.font			= font;
			this.context.textBaseline	= 'top';
		}

		this.Text = function( x, y, msg ) {
			this.context.fillText(msg, x, y);
		}

		this.GetTextWidth = function(text) {
			var metrics = this.context.measureText(text);
			return metrics.width;
		}
		
		this.GetFontSize = function() {
			return parseInt(this.canvas.css('font-size'));
		}

		this.WrapText = function (x, y, maxWidth, lineHeight, text) {
			var words = text.split(" ");
			var line = "";
		 
			for (var n = 0; n < words.length; n++) {
				var testLine = line + words[n] + " ";
				var metrics = this.context.measureText(testLine);
				var testWidth = metrics.width;
				if (testWidth > maxWidth) {
					this.context.fillText(line, x, y);
					line = words[n] + " ";
					y += lineHeight;
				}
				else {
					line = testLine;
				}
			}
			this.context.fillText(line, x, y);
		}

		this.ImgBlt = function( x, y, img, srcX, srcY, srcWidth, srcHeight, renderWidth, renderHeight ) {
			if(!img.isLoaded)
				return

			if(renderWidth == undefined)
				renderWidth = srcWidth

			if(renderHeight == undefined)
				renderHeight = srcHeight

			this.context.drawImage( img, srcX, srcY, srcWidth, srcHeight, x, y, renderWidth, renderHeight);
		}

		
		this.Img = function( x, y, img, patternX, patternY, n ) {
			if(!img.isLoaded)
				return;

			if(patternX == undefined)
				patternX = img.width;

			if(patternY == undefined)
				patternY = img.height;

			if(n == undefined)
				n = 0;

			var px = Math.round(n % (img.width / patternX));
			var py

			if(n < (img.width / patternX))
				py = 0;
			else
				py = Math.round(n / (img.width / patternX))

			this.context.drawImage( img, px * patternX, py * patternY, patternX, patternY, x, y, patternX, patternY);
		}

		this.ImgFlipH = function( x, y, img, patternX, patternY, n ) {
			if(!img.isLoaded)
				return;

			this.context.save();
			this.context.scale(-1, 1)

			if(patternX == undefined)
				patternX = img.width;

			if(patternY == undefined)
				patternY = img.height;

			if(n == undefined)
				n = 0;

			var px = Math.round(n % (img.width / patternX))
			var py

			if(n < (img.width / patternX))
				py = 0;
			else
				py = Math.round(n / (img.width / patternX))

			//this.context.drawImage( img, px * patternX, py * patternY, patternX, patternY, -this.width + x , y, patternX, patternY);

			this.context.drawImage( img, px * patternX, py * patternY, patternX, patternY, -x - patternX , y, patternX, patternY)

			this.context.restore()
		}	
		

		this.RoundRect = function(x, y, width, height, radius, fill, stroke) {
	//http://stackoverflow.com/questions/1255512/how-to-draw-a-rounded-rectangle-on-html-canvas
			if (typeof stroke == "undefined" ) stroke = false; 
			if (typeof radius === "undefined") radius = 5;
			if (typeof fill === "undefined") fill = 5;

			this.context.beginPath();
			this.context.moveTo(x + radius, y);
			this.context.lineTo(x + width - radius, y);
			this.context.quadraticCurveTo(x + width, y, x + width, y + radius);
			this.context.lineTo(x + width, y + height - radius);
			this.context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
			this.context.lineTo(x + radius, y + height);
			this.context.quadraticCurveTo(x, y + height, x, y + height - radius);
			this.context.lineTo(x, y + radius);
			this.context.quadraticCurveTo(x, y, x + radius, y);
			this.context.closePath();

			if (stroke)  this.context.stroke();
			if (fill) this.context.fill();
		}

		this.Rect = function(x, y, w, h) {
			this.context.fillRect(x,y,w,h);
		}
		
		this.RectStroke = function(x, y, w, h) {
			this.context.lineWidth = 1;
			this.context.strokeRect(x,y,w,h);
		}
		
		this.Line = function( x1, y1, x2, y2 ) {
			this.context.beginPath();	
			this.context.strokeStyle = this.context.fillStyle;
			this.context.moveTo( x1, y1 );
			this.context.lineTo( x2, y2 );		
			this.context.stroke();		
		}

		this.Circle = function(cx, cy, r) {
			this.context.beginPath();
			this.context.arc(cx, cy, r, 0, Math.PI*2, true); 
			this.context.closePath();
			this.context.fill();
		};
		
		this.SetColor = function( color ) {
			this.context.fillStyle = color;
		};
	}; 
	
	this.Loader = new function() {
		this.list = [];

		this.OnLoadComplete = function(item) {
			var res = this.Get(item.src);
			if(res == null)
				return;

			res.isLoaded = true;
			console.log(res.src + " load complete");
		};

		this.Load = function(src) {
			for( var idx in this.list ) {
				if(this.list[idx].src == src)
				{
					console.log("already registered image " + src );
					return this.list[idx];
				}
			};
		
			var newImage = new Image();
			this.list.push( newImage );

			var Loader = this;
			newImage.onload = function() { Loader.OnLoadComplete(this) } ;
			newImage.onerror = function() { console.log("error : load " + src + " failed") } ;
			newImage.isLoaded = false;
			newImage.src = src;

			return newImage;
		};

		this.Get = function( src ) {
			for( var i = 0; i < this.list.length; ++i) {
				if( this.list[i].src == src )	
					return this.list[i];
			}

			console.log("not registered imageName " + imageName);
			return null;
		};

		this.AllLoadComplete = function() {
			for( var idx in this.list ) {
				if(!this.list[idx].isLoaded)
					return false;
			} 

			return true;
		};
	}; 
}

$(document).ready(function() {
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
	var test = $2.Loader.Load('test.png');

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
		r.Img(0,0,test);	
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
});
