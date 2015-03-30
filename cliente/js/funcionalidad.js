global.gui = require("nw.gui");
global.win = global.gui.Window.get();
global.win.isMaximizada = false;

global.nueva;

global.s = require("net").Socket();

global.conectado = false;

global.canal= "imaqtpie";

global.buffer = "";

function ventanaConectar()
{
	global.win.blur();
	global.nueva = global.gui.Window.open("conectar.html", {
		position: 'center',
		width: 600,
		height: 300,
		toolbar : false,
		frame: false,
		resize: false
	});

	global.nueva.on("close",function()
	{
		if(global.conectar)
		{
			global.s.connect(6667, "irc.twitch.tv",function(){
				global.nueva.close(true);
			});

			global.s.on("data",function(data){

				global.buffer += data;

				global.conectado = true;

				while(global.buffer.indexOf('\n') != -1)
				{
					var actual = global.buffer.substring(0,global.buffer.indexOf('\n'));
					global.buffer = global.buffer.substring(global.buffer.indexOf('\n')+1);

					procesar(actual);

					

					
				}
			});

			global.s.on("error",function()
			{
				alert("error");
			});

			global.s.on("close",function(){
				global.conectado = false;
				alert("cerrar");
				global.s.end();
			})
			alert(localStorage.nick);

			global.s.write("PASS "+localStorage.token+"\n");
			global.s.write("NICK "+localStorage.nick+"\n");
			global.s.write("CAP REQ :twitch.tv/tags\n");
		}
		global.nueva.close(true);
	});

	global.win.on("close",function()
	{
		global.s.end();
		this.close(true);
	});
}




function procesar (linea)
{

	if(linea.substring(0,4)=="PING")
	{
		global.s.write("PONG tmi.twitch.tv\r\n");
	}

	if($("#conversacion").scrollTop()+ $("#conversacion").height()== $("#conversacion")[0].scrollHeight)
	{
		$("#conversacion").append("<br \><div class='row fila'><div class='nick'>Shaaw</div><div class='textoconv'><p>"+linea+"</p></div></div>");
		redimensionarH(null);
		$("#texto").focus();
		$("#conversacion").scrollTop($("#conversacion")[0].scrollHeight);
	}else
	{
		$("#conversacion").append("<br \><div class='row fila'><div class='nick'>Shaaw</div><div class='textoconv'><p>"+linea+"</p></div></div>");
		redimensionarH(null);
		$("#texto").focus();
	}

}

function redimensionarH(valor)
{

	var tamano2 = $(".fila").width() - 150-5;
	$(".textoconv").width(tamano2+"px");
}

function redimensionarV(valor)
{
	var tamano = global.win.height-26-72-valor;
	document.getElementById("conversacion").style.height=tamano+"px";

	$("#nicks").height((tamano-20)+ "px");
}

function carga()
{
	$(document).keypress(function(event){
		var keynum;

            if(window.event){ // IE					
            	keynum = event.keyCode;
            }else
            {
                if(event.which){ // Netscape/Firefox/Opera					
                	keynum = event.which;
                }
            }
            if(keynum== 13 && $("#texto").is(":focus"))
            {
            	enviar();
            }
            
        })

	redimensionarV(0);


	redimensionarH(null);

	global.win.on("maximize",function()
	{

		global.win.isMaximizada = true;
		var addicional =0;
		if(global.win.isMaximizada)
		{
			addicional= 20;
		}
		redimensionarV(addicional);
	});
	global.win.on("unmaximize",function()
	{
		global.win.isMaximizada = false;
	});
	global.win.on('resize',function(width,height){
		console.log("resize");
		var addicional =0;
		if(global.win.isMaximizada)
		{
			addicional= 15;
		}
		var tamano = height-26-72-addicional;

		document.getElementById("conversacion").style.height=tamano+"px";

		var tamano2 = $(".fila").width() - 155;
		$(".textoconv").width(tamano2+"px");

		$("#nicks").height((tamano-20)+ "px");

	});


	var option = {
		key : "Enter",
		active : function(){

			$("#conversacion").append("<br \><div class='row fila'><div class='nick'>Shaaw</div><div class='textoconv'><p>"+$("#texto").val()+"</p></div></div>");
			$("#texto").val("");
			$("#texto").focus();
		},
		failed : function(msg) {
			console.log(msg);
		}
	};


	

}

function unirse()
{
	if(global.conectado == true)
	{
		global.canal = $("#canal").val();
		global.s.write("JOIN #"+global.canal+"\n");
	}
}

function cerrar()
{
	global.win.close();
}

function minimizar()
{
	global.win.minimize(); 
}

function maximizar()
{
	if(global.win.isMaximizada)
	{
		global.win.unmaximize();
	}else
	{
		global.win.maximize();
	}
}


function enviar()
{
	if($("#conversacion").scrollTop()+ $("#conversacion").height()== $("#conversacion")[0].scrollHeight)
	{


		$("#conversacion").append("<br \><div class='row fila'><div class='nick'>Shaaw</div><div class='textoconv'><p>"+$("#texto").val()+"</p></div></div>");
		$("#conversacion").scrollTop($("#conversacion")[0].scrollHeight);


	}else
	{
		$("#conversacion").append("<br \><div class='row fila'><div class='nick'>Shaaw</div><div class='textoconv'><p>"+$("#texto").val()+"</p></div></div>");

	}

	global.s.write("PRIVMSG #"+global.canal + " :"+$("#texto").val()+"\n");
	$("#texto").val("");
	$("#texto").focus();

}