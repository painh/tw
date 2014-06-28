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

function ajaxReq(url, arg, successFunc, type, dataType)
{
	dataType = dataType | "json";
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
            dataType: dataType,
            timeout: 1000 * 60,
            error: function (xhr, ajaxOptions, thrownError)
            {
                alert("url : " + url + "\n" + xhr.responseText);
                alert(thrownError);
            },
            success: function(json)
                        { 
                            if(successFunc)
                                successFunc(json)
                        }
        });
}

function FileRead(filename, func)
{
	var data = new Object();

    $.ajax({url: filename,
            type: 'GET',
            dataType: 'text',
            timeout: 1000 * 60,
            error: function (xhr, ajaxOptions, thrownError)
            {
                console.log("url : " + filename + "\n" + xhr.responseText);
                alert(thrownError);
            },
            success: function(raw)
                        { 
							data.raw = raw ;
							if(func)
								func(raw);
                        }
        });

	return data;
}

function FileWrite(filename, con, func)
{
	ajaxReq('file_write.php', {filename:filename, contents : con}, function(json)
	{
		if(func)
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

var core = function() {
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
			console.log( "[ " + this.GetCompleteCnt() + " / " + Object.keys(this.list).length + " ] " + res.key + " / " + res.src + " load complete");
		};

		this.Load = function(key, src, desc) {
			src = src.toLowerCase();
			for( var idx in this.list ) {
				if(this.list[idx].src == src) {
					console.log("already registered image " + src );
					return this.list[idx];
				}
			};

			var ext = src.replace(/\..+$/, '');;
			var Loader = this;
			var ext = src.replace(/^.*\./, '');


			switch(ext) {
				case 'png':
				case 'jpg':
				case 'jpeg':
					var newImage = new Image();
					this.list[key] = newImage;

					newImage.onload = function() { Loader.OnLoadComplete(this) } ;
					newImage.onerror = function() { console.log("error : load " + src + " failed") } ;
					newImage.isLoaded = false;
					newImage.key = key;
					newImage.src = src;
					newImage.desc = desc;

					return newImage;
			}

			var obj = { src : src,
						key : key,
						desc : desc,
						isLoaded : false };
			this.list[key] = obj;

			FileRead( src, function(raw) {
				obj.raw = raw;
				Loader.OnLoadComplete(obj);
			});

			return obj; 
		
		};

		this.Get = function( src ) {
			for( var i in this.list ) {
				if( this.list[i].src == src )	
					return this.list[i];
			}

			console.log("not registered imageName " + src);
			return null;
		};

		this.AllLoadComplete = function() {
			for( var idx in this.list ) {
				if(!this.list[idx].isLoaded)
					return false;
			} 

			return true;
		};

		this.GetCompleteCnt = function() {
			var cnt = 0;
			for( var idx in this.list ) {
				if(this.list[idx].isLoaded)
					cnt++;
			} 

			return cnt;
		};
	}; 

	this.Camera = new function() {
		this.x = 0;
		this.y = 0;

	};
}


