global.gui = require("nw.gui");
global.win = global.gui.Window.get();
global.win.isMaximizada = false;

global.nueva;

global.irc = require("twitch-irc");

global.conectado = false;

global.canal= "";

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
			var clientOptions = {
				options:
				{
					debug : true,

				},
				identity: {
					username: localStorage.nick,
					password: localStorage.token
				}
			}

			global.nueva.close(true);
			
			global.client = new irc.client(clientOptions);
			global.client.conect();

			global.client.addListener('chat', function(channel,user,message)
			{

				procesar(user,messsage);

			});	


		}
	});


		global.nueva.close(true);
	});

	
}




function procesar (user,linea)
{


	if($("#conversacion").scrollTop()+ $("#conversacion").height()== $("#conversacion")[0].scrollHeight)
	{
		$("#conversacion").append("<br \><div class='row fila'><div class='nick' style='color:  "+user.color+"'>"+user.username+"</div><div class='textoconv'><p>"+linea+"</p></div></div>");
		redimensionarH(null);
		$("#texto").focus();
		$("#conversacion").scrollTop($("#conversacion")[0].scrollHeight);
	}else
	{
		$("#conversacion").append("<br \><div class='row fila'><div class='nick' style='color:  "+user.color+"'>"+user.username+"</div><div class='textoconv'><p>"+linea+"</p></div></div>");
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


	

}

function unirse()
{
	if(global.conectado == true)
	{
		global.join(global.canal);
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

	global.client.say(global.canal,$('#texto').val());
	$("#texto").val("");
	$("#texto").focus();

}