global.gui = require("nw.gui");
global.win = global.gui.Window.get();
global.win.isMaximizada = false;
global.canalConectado = false;

global.gui.App.setCrashDumpDir("logs");
global.nueva;

var request = require("request");

global.irc = require("twitch-irc");

global.conectado = false;

global.canal= "skadoodle";

global.buffer = "";


function procesar (user,linea)
{

	var hora = new Date();


	if($("#conversacion").scrollTop()+ $("#conversacion").height()== $("#conversacion")[0].scrollHeight)
	{
		$("#conversacion").append("<br \><div class='row fila'><div class='timeStamp'>"+hora.getHours()+":"+hora.getMinutes()+"</div><div class='nick' style='color:  "+user.color+"'>"+user.username+"</div><div class='textoconv'><p>"+linea+"</p></div></div>");
		redimensionarH(null);
		$("#conversacion").scrollTop($("#conversacion")[0].scrollHeight);
	}else
	{
		$("#conversacion").append("<br \><div class='row fila'><div class='timeStamp'>"+hora.getHours()+":"+hora.getMinutes()+"</div><div class='nick' style='color:  "+user.color+"'>"+user.username+"</div><div class='textoconv'><p>"+linea+"</p></div></div>");
		redimensionarH(null);
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
	$(".btn").mouseup(function(){
		$(this).blur();
	})
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
            
        });

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
	

	$("#myModal").on('show.bs.modal', function(e)
	{
		$("#nick").val(localStorage.nick);
		$("#token").val(localStorage.token);
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

		if(global.canalConectado == true)
		{
			global.client.part(global.canal);
			if($("#conversacion").scrollTop()+ $("#conversacion").height()== $("#conversacion")[0].scrollHeight)
			{


				$("#conversacion").append("<br \><div class='row fila'><div class='nick'>System</div><div class='textoconv'><p>Salio del canal</p></div></div>");
				$("#conversacion").scrollTop($("#conversacion")[0].scrollHeight);


			}else
			{
				$("#conversacion").append("<br \><div class='row fila'><div class='nick'>System</div><div class='textoconv'><p>Salio del canal</p></div></div>");

			}

			global.canalConectado = false;
		}

		global.canal= $('#canal').val();
		global.client.join(global.canal).then(function(){

			global.canalConectado = true;

			if($("#conversacion").scrollTop()+ $("#conversacion").height()== $("#conversacion")[0].scrollHeight)
			{


				$("#conversacion").append("<br \><div class='row fila'><div class='nick'>System</div><div class='textoconv'><p>Se unio al canal</p></div></div>");
				$("#conversacion").scrollTop($("#conversacion")[0].scrollHeight);


			}else
			{
				$("#conversacion").append("<br \><div class='row fila'><div class='nick'>System</div><div class='textoconv'><p>Se unio al canal</p></div></div>");

			}


			request('https://tmi.twitch.tv/group/user/' + global.canal.toLowerCase() + '/chatters', function (error, response, body) {
				if (!error && response.statusCode == 200) {
					body = JSON.parse(body);
					console.log('There are ' + body.chatter_count + ' chatters in this room.');
					console.log('Current moderators in this room are:');
					console.log(body.chatters.moderators);
					$("#nicks").empty();

					for(var i = 0; i < body.chatters.moderators.length;i++){
						$("#nicks").append("<option class='moderador'>"+ body.chatters.moderators[i] +"</option>");
					}

					for(var i = 0; i < body.chatters.staff.length;i++){
						$("#nicks").append("<option class='staff'>"+ body.chatters.staff[i] +"</option>");
					}


					for(var i = 0; i < body.chatters.viewers.length;i++){
						$("#nicks").append("<option class='viewers'>"+ body.chatters.viewers[i] +"</option>");
					}
				}
			});


		});


if(global.canalConectado == true)
{
	global.intervalos[global.canal] = setInterval(function(){
		request('https://tmi.twitch.tv/group/user/' + global.canal.toLowerCase() + '/chatters', function (error, response, body) {
			if (!error && response.statusCode == 200) {
				body = JSON.parse(body);
				console.log('There are ' + body.chatter_count + ' chatters in this room.');
				console.log('Current moderators in this room are:');
				console.log(body.chatters.moderators);
				$("#nicks").empty();

				for(var i = 0; i < body.chatters.moderators.length;i++){
					$("#nicks").append("<option class='moderador'>"+ body.chatters.moderators[i] +"</option>");
				}

				for(var i = 0; i < body.chatters.staff.length;i++){
					$("#nicks").append("<option class='staff'>"+ body.chatters.staff[i] +"</option>");
				}


				for(var i = 0; i < body.chatters.viewers.length;i++){
					$("#nicks").append("<option class='viewers'>"+ body.chatters.viewers[i] +"</option>");
				}
			}
		});
	},120000);
}
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
	if(global.conectado && global.canalConectado)
	{
		if($("#conversacion").scrollTop()+ $("#conversacion").height()== $("#conversacion")[0].scrollHeight)
		{


			$("#conversacion").append("<br \><div class='row fila'><div class='nick'>"+localStorage.nick+"</div><div class='textoconv'><p>"+$("#texto").val()+"</p></div></div>");
			$("#conversacion").scrollTop($("#conversacion")[0].scrollHeight);


		}else
		{
			$("#conversacion").append("<br \><div class='row fila'><div class='nick'>"+localStorage.nick+"</div><div class='textoconv'><p>"+$("#texto").val()+"</p></div></div>");

		}

		global.client.say(global.canal,$('#texto').val());
	}
	$("#texto").val("");
	$("#texto").focus();



}


function conectar()
{

	localStorage.nick = $("#nick").val();
	localStorage.token = $("#token").val();



	global.conectar = true;

	if(global.conectar)
	{
		var clientOptions = {
			options:
			{
				debug : true

			},
			identity: {
				username: localStorage.nick,
				password: localStorage.token
			},
			channels: []
		}


		global.client = new global.irc.client(clientOptions);
		global.client.addListener('connectfail', function () {
			alert("fallo");
		});

		global.client.addListener('crash', function (message, stack) {
			alert(message+" "+stack);
		});


		global.client.connect().then(function()
		{
			global.conectado = true;

			if($("#conversacion").scrollTop()+ $("#conversacion").height()== $("#conversacion")[0].scrollHeight)
			{


				$("#conversacion").append("<br \><div class='row fila'><div class='nick'>System</div><div class='textoconv'><p>Conectado</p></div></div>");
				$("#conversacion").scrollTop($("#conversacion")[0].scrollHeight);


			}else
			{
				$("#conversacion").append("<br \><div class='row fila'><div class='nick'>System</div><div class='textoconv'><p>Conectado</p></div></div>");

			}



		});

		global.client.addListener('chat', function(channel,user,message)
		{

			procesar(user,message);

		});	


	}
	$("#myModal").modal('hide');
}

function abrirBrowser()
{

	global.gui.Shell.openExternal("http://twitchapps.com/tmi/");

}