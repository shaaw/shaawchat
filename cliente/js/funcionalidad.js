var gui = require("nw.gui");
var win = gui.Window.get();
win.isMaximizada = false;
var token = "oauth:h9qxzvmbkd6snnjb9to1fp7hsf8652";

var s = require("net").Socket();

var conectado = false;

var canal= "steel_tv";

var buffer = "";

function procesar (linea)
{

	if(buffer.substring(0,4)=="PING")
	{
		s.write("PONG tmi.twitch.tv\r\n");
	}

	if($("#conversacion").scrollTop()+ $("#conversacion").height()== $("#conversacion")[0].scrollHeight)
	{
		$("#conversacion").append("<br \><div class='row fila'><div class='nick'>Shaaw</div><div class='textoconv'><p>"+linea+"</p></div></div>");
		$("#texto").focus();
		$("#conversacion").scrollTop($("#conversacion")[0].scrollHeight);
	}else
	{
		$("#conversacion").append("<br \><div class='row fila'><div class='nick'>Shaaw</div><div class='textoconv'><p>"+linea+"</p></div></div>");
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
	var tamano = win.height-26-72-valor;
	tamano= tamano+"px";
	document.getElementById("conversacion").style.height=tamano;
}

function carga()
{
	redimensionarV(0);


	redimensionarH(null);

	win.on("maximize",function()
	{

		win.isMaximizada = true;
		var addicional =0;
		if(win.isMaximizada)
		{
			addicional= 20;
		}
		redimensionarV(addicional);
	});
	win.on("unmaximize",function()
	{
		win.isMaximizada = false;
	});
	win.on('resize',function(width,height){
		console.log("resice");
		var addicional =0;
		if(win.isMaximizada)
		{
			addicional= 15;
		}
		var tamano = height-26-72-addicional;
		tamano= tamano+"px";
		document.getElementById("conversacion").style.height=tamano;

		var tamano2 = $(".fila").width() - 155;
		$(".textoconv").width(tamano2+"px");
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

	var shortcut = new gui.Shortcut(option);

	shortcut.on('active', function() {
		console.log("Global desktop keyboard shortcut: " + this.key + " active."); 
	});

	shortcut.on('failed', function(msg) {
		console.log(msg);
	});

	s.connect(6667, "irc.twitch.tv",function(){
		alert("conectado");
	});

	s.on("data",function(data){

		buffer += data;

		while(buffer.indexOf('\n') != -1)
		{
			var actual = buffer.substring(0,buffer.indexOf('\n'));
			buffer = buffer.substring(buffer.indexOf('\n')+1);

			

			procesar(actual);


			redimensionarH(null);

			if(conectado == false)
			{
				conectado = true;
				s.write("JOIN #"+canal+"\n");
				s.write("TWITCHCLIENT 1\n");
			}


		}
	});

	s.on("error",function()
	{
		alert("error");
	});

	s.on("close",function(){
		conectado = false;
		alert("cerrar");
		s.end();
	})

	s.write("PASS "+token+"\n");
	s.write("NICK shaawsc2\n");

}

function cerrar()
{
	win.close();
}

function minimizar()
{
	win.minimize(); 
}

function maximizar()
{
	if(win.isMaximizada)
	{
		win.unmaximize();
	}else
	{
		win.maximize();
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
	
	s.write("PRIVMSG #"+canal + " :"+$("#texto").val()+"\n");
	$("#texto").val("");
	$("#texto").focus();
	
}