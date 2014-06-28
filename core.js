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

var core = function() {
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
			var res = this.GetBySrc(item.src, true);
			if(res == null)
				return;

			res.isLoaded = true;
			if(config['showLoadProcess'])
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

		this.GetBySrc = function(src, showError) {
			for( var i in this.list ) {
				if( this.list[i].src == src )	
					return this.list[i];
			}

			if(showError)
				console.warn("not registered file(src)" + src);

			return null;
		};

		this.GetByKey = function( key , showError) {
			for( var i in this.list ) {
				if( this.list[i].key == key )	
					return this.list[i];
			}

			if(showError)
				console.warn("not registered file(key)" + key);

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
		this.target = "USER";

		this.Update = function()
		{
			if(this.target == "USER")
			{
			}
		}

		this.SetTarget = function(target)
		{
			this.target = target;
		} 
	};

	var Obj = function(core, name) {
		this.x = 0;
		this.y = 0;
		this.name = name;
		this.img = "";
		this.core = core;
	}

	Obj.prototype.SetImg = function(resKey)
	{
		var img = this.core.Loader.GetByKey(resKey, true);
		if(!img)
			return;

		this.img = img;
	};

	Obj.prototype.Update = function()
	{
		
	};

	Obj.prototype.Render = function()
	{
		if(this.img != "")
		{
			var x = this.x;
			var y = this.y;
			this.core.Renderer.Img(x, y, this.img); 
		} 
	};

	var ObjList = function(core)
	{ 
		this.list = [];
		this.core = core;

		this.Clear = function() {
			this.list = [];
		};


		this.GetChrByPos = function(x,y) {
			var list = [];

			for(var i in this.list) {
				var item = this.list[i];
				if((item.x == x) && (item.y == y))
					list.push(item);
			}

			return list;
		};

		this.Add = function(name)
		{
			var obj = this.Get(name, false);
			if(obj)
			{
				console.warn("already registered obj " + name);
				return false;
			}

			obj = new Obj(core, name); 
			this.list.push(obj); 
		} 

		this.Get = function(name, showError)
		{
			for(var i in this.list) {
				var item = this.list[i];
				console.log(item);
				if(item.name == name)
					return item;
			}

			if(showError)
				console.warn('object found failed ' + name);

			return null;
		} 

		this.ClearObjectType = function(type) {
			var deadList = [];
			for(var i in this.list) {
				var item = this.list[i];
				if(item.type != type)
					continue;

				item.isDead = true;
				deadList.push(item);
			}

			for(var i in deadList)
				removeFromList(this.list, deadList[i]);

			for(var i in this.list) {
				var item = this.list[i];
				if(item.isDead)
					console.log('dead alive');
			}
		}

		this.Update = function() {
			var prevCnt = this.moveCnt;
			this.moveCnt = 0;

			var deadList = [];
			for(var i in this.list) {
				var item = this.list[i];
				item.Update();
				if(item.isDead)
				deadList.push(item);
			}

			for(var i in deadList)
				removeFromList(this.list, deadList[i]);

			for(var i in this.list) {
				var item = this.list[i];
				if(item.isDead)
				console.log('dead alive');
			} 
		}

		this.Render = function() {
			for(var i in this.list) {
				var item = this.list[i];
				item.Render();
			}
		}

		this.CheckCollision = function(x, y, obj) {

			if(obj && obj.isDead)
				return [];

			var list = [];

			for(var i in this.list) {
				var item = this.list[i];
				if(item == obj)
				continue;

				if(item.isDead)
				continue;

				if(!(x >= item.x + TILE_WIDTH ||
				x + TILE_WIDTH <= item.x ||
				y >= item.y + TILE_HEIGHT ||
				y + TILE_HEIGHT <= item.y))
				list.push(item);
			}
			return list;
		};
	};

	this.Interpreter = new function() {
		this.core = {};
		this.space = 'unknown';
		this.line = 0;

		this.oneLine = function(oneLine) { 
			var flag = false;

			if(oneLine.hasOwnProperty('//'))
				return;

			for(var i in this)
			{
				if(i == oneLine['cmd'])
					flag = true;

			}

			if(!flag)
			{
				console.warn('invalid cmd! ' + this.space + ":" + this.line);
				console.warn(oneLine);
				return;
			}

			var args = oneLine['args'] || null; 

			this[oneLine['cmd'].toLowerCase()](args);
		}

		this.Run = function(core, space, script) {
			this.line = 1;
			this.core = core;
			this.space = space;

			if(config['showInterpreterProcess'])
				console.log('start script ' + this.space);

			for(var i in script) {
				var item = script[i];
				if(config['showInterpreterProcess'])
					console.log(item);

				this.oneLine(item);
				this.line++;
			} 
		}

		this.CheckArgument = function(args, reqArg) {
			for(var i in reqArg) {
				var flag = false;
				for(var j in args)
					if(j == reqArg[i])
						flag = true;

				if(flag == false) {
					console.warn( this.space + ":"+this.line+" 인자가 부족합니다 " + reqArg[i]);
					return false;
				}
			}

			return true; 
		}


		this.setcameratarget = function(args) {
			if(!this.CheckArgument(args, ['target']))
				return; 

			this.core.Camera.SetTarget(args['target']);
		} 

		this.addobj = function(args) {
			if(!this.CheckArgument(args, ['name']))
				return; 

			this.core.ObjList.Add(args['name']);
		} 

		this.setobjimg = function(args) {
			if(!this.CheckArgument(args, ['name', 'resKey']))
				return; 

			var obj = this.core.ObjList.Get(args['name'], true);
			if(!obj)
				return;

			obj.SetImg(args['resKey']);
		} 

	}; 
	//
// core code
	this.ArgumentList = [];

	this.lastTime = new Date().getTime();
	this.fps = 0;
	this.lastFPS = 0;
	this.fps = 0;
	this.totalFPS = 0;
	this.globalNow = new Date();
	this.ObjList = new ObjList(this);


	this.RandomRange = function(n1, n2) {
			return Math.floor( (Math.random() * (parseInt(n2) - parseInt(n1) + 1)) + parseInt(n1) );
	};

	this.removeFromList = function (list, obj) {
			var idx = list.indexOf(obj);
			list.splice(idx, 1);
	};

	this.ToJSON = function(name, raw)
	{
		try
		{
			var data = JSON.parse(raw); 
			return data;
		}
		catch(e)
		{
			alert(name + "\n" + e.message);
			return null;
		}
	}

	this.OnLoadComplete = function() {
		var data = this.ToJSON("entry", this.Loader.GetByKey('entry', true).raw);
		if(data)
			this.Interpreter.Run(this, 'OnLoadComplete', data['OnLoadComplete']);
	};

	this.StartLoop = function()
	{
		var interval = 1000 / config["fps"];
		var core = this;
		var timer = setInterval( function() {
			core.globalNow = new Date();

			if(core.MouseManager.prevLDown == false && core.MouseManager.LDown )
				core.MouseManager.Clicked = true;

			if(core.MouseManager.prevLDown == true && core.MouseManager.LDown == false )
				core.MouseManager.Upped = true;
//update
			core.ObjList.Update();
			core.Camera.Update();
//render
			var r = core.Renderer;
			r.SetColor(r.clearColor);
			r.Rect(0, 0, config['width'], config['height']);
			r.SetColor(r.defaultColor); 
			core.ObjList.Render();
			core.fps++;
			r.Text(0, 0, "FPS : " + core.lastFPS );
			r.frontContext.drawImage(r.backCanvas, 0, 0,
								r.width, r.height, 0, 0, r.backCanvas.width, r.backCanvas.height); 
//render end	
			var curDate = new Date();
			core.globalNow = curDate.getTime();

			if(core.globalNow - core.lastTime > 1000) {
				core.lastFPS = core.fps;
				core.fps = 0;
				core.lastTime = core.globalNow;
			}
			
			core.MouseManager.prevLDown = core.MouseManager.LDown;
			core.MouseManager.Upped = false;
			core.MouseManager.Clicked = false;

			core.KeyManager.EndFrame();

			++core.totalFPS;
		}, interval); 
	}; 
} 

