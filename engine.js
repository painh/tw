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

function trace( msg )
{
	$2.Console.Trace(msg);
}

var $2 = function() {
		this.ArgumentList = [];

		this.totalFPS = 0;
		this.globalNow = new Date();

		this.RandomRange = function(n1, n2) {
				return Math.floor( (Math.random() * (parseInt(n2) - parseInt(n1) + 1)) + parseInt(n1) );
		};

		this.removeFromList = function (list, obj) {
				var idx = list.indexOf(obj);
				list.splice(idx, 1);
		};

// Console
		var console = function(width, height) {
            $("<p id = 'consoletest' class='consoleP' >M</p>").appendTo("#consoleDiv");
            var consoleDiv = $("<div id='consoleDiv'></div>").appendTo("#game");
            $('#consoletest').remove();

            return {
                consoleDiv : consoleDiv,
                line : 0,
                prefix : "",
                fontWidth : consoleDiv.width(),
                fontHeight : consoleDiv.height(),
                maxLineOnScreen : height / consoleDiv.height(),
                Trace : function(msg) {
                    this.line++;
                    if(config['showLogOnDebugger']) {
                        $("<p id = 'consoleP' class='consoleP' >"+ this.prefix + msg+"</p>").appendTo("#consoleDiv");
                        if( this.line > this.maxLineOnScreen )
                            $("#consoleP:first").remove();
                    }

                    if(config['showLogOnDebugger'])
                        if(console && console.log)
                            console.log(this.prefix+msg);
                }
            }
		}();


	this.KeyManager = function()
	{
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

		for( var i = 0; i < 255; ++i)
		{
			this.KeyMapPrevFrame[i] = false;
			this.keyMap[i] = false;
		}

		this.KeyDown = function(keyCode)
		{
			if(keyCode >= 255)
				return;

			this.keyMap[keyCode] = true;
		}

		this.KeyUp = function(keyCode)
		{
			if(keyCode >= 255)
				return;

			console.log(keyCode);

			this.keyMap[keyCode] = false;
		}

		this.IsKeyPress = function(keyCode)
		{
			if(keyCode >= 255)
				return false;

			if(( this.KeyMapPrevFrame[keyCode] == false ) && (this.keyMap[keyCode] == true) )
				return true;

			return false;
		};

		this.IsKeyDown = function(keyCode)
		{
			if(keyCode >= 255)
				return false;

			return this.keyMap[keyCode];
		};

		this.EndFrame = function()
		{
			for( var i = 0; i < 255; ++i)
				this.KeyMapPrevFrame[i] = this.keyMap[i];
		};
	}();

	this.MouseManager = function() {
		this.x = 0;
		this.y = 0;
		this.LDown = false;
		this.prevLDown = false;
		this.Clicked = false;
		this.Upped = false;


        this.mouseDown = function(e)
        {
            e.preventDefault();

            if(!MouseManager)
                return false;

            var pageX, pageY;
            if(e.type.indexOf("touch") == 0)
            {
                pageX = e.originalEvent.touches[0].pageX;
                pageY = e.originalEvent.touches[0].pageY;
            }
            else
            {
                pageX = e.pageX;
                pageY = e.pageY;
            }

            var offsetX = $("#game").offset().left;
            var offsetY = $("#game").offset().top;
            MouseManager.x = Math.floor((pageX - offsetX) / config["screenScale"]);
            MouseManager.y = Math.floor((pageY - offsetY) / config["screenScale"]);

            MouseManager.LDown = true;
            return false;
        }

        this.mouseMove = function(e)
        {
            e.preventDefault();

            if(!MouseManager)
                return false;

            var pageX, pageY;
            if(e.type.indexOf("touch") == 0)
            {
                pageX = e.originalEvent.touches[0].pageX;
                pageY = e.originalEvent.touches[0].pageY;
            }
            else
            {
                pageX = e.pageX;
                pageY = e.pageY;
            }

            var offsetX = $("#game").offset().left;
            var offsetY = $("#game").offset().top;
            MouseManager.x = Math.floor((pageX - offsetX) / config["screenScale"]);
            MouseManager.y = Math.floor((pageY - offsetY) / config["screenScale"]);
            return false;

        }

        this.mouseUp = function(e)
        {
            e.preventDefault();

            if(!MouseManager)
                return false;

            MouseManager.LDown = false;
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

    $(window).keydown(function(e) {
        if(e.keyCode == 220)
            $("#consoleDiv").slideToggle();

        if(KeyManager)
            KeyManager.KeyDown(e.keyCode);
    });

    $(window).keyup(function(e) {
        if(KeyManager)
            KeyManager.KeyUp(e.keyCode);
    });

    var interval = 1000 / config["fps"];
    var timer = setInterval( function()    {
        return;
        $2.Console.prefix = totalFPS + " : ";
        $2.globalNow = new Date();

        if($2.MouseManager.prevLDown == false && $2.MouseManager.LDown )
            $2.MouseManager.Clicked = true;

        if($2.MouseManager.prevLDown == true && $2.MouseManager.LDown == false )
            $2.MouseManager.Upped = true;

//        SceneManager.Update();
//
//        Renderer.Begin();
//        SceneManager.Render();
//        Renderer.End();

        $2.MouseManager.prevLDown = $2.MouseManager.LDown;
        $2.MouseManager.Upped = false;
        $2.MouseManager.Clicked = false;

        $2.KeyManager.EndFrame();

        ++$2.totalFPS;
    }, interval);

    AllowZoom(false);

    return {
        Console : console
    };
}();

$(document).ready(function() {
    console.log($2);
    trace("sdfkljhsdaf");
    if(config["gameDivAlign"] == "center")
        $("#game").css( { position : "absolute", top : "50%", left : "50%",  margin: "-" + (config["height"] * config["screenScale"])/ 2 + "px 0 0 -" + (config["width"] * config["screenScale"]) / 2+ "px"} );

    document.title = config['title'];
});
