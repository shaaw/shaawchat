global.gui = require("nw.gui");
global.gui.Window.get().showDevTools();
global.win = global.gui.Window.get();
global.win.isMaximizada = false;
global.canalConectado = false;
global.https = require("https");
global.userList = [];
global.nueva;

global.defaultColors = [
'#FF0000','#0000FF','#008000','#B22222','#FF7F50',
'#9ACD32','#FF4500','#2E8B57','#DAA520','#D2691E',
'#5F9EA0','#1E90FF','#FF69B4','#8A2BE2','#00FF7F'
],
global.randomColorsChosen = {};

// global.irc = require("tmi.js");



global.conectado = false;

global.canal= "";

global.buffer = "";

function resolveColor(chan, name, color) {
	if(color !== null) {
		return color;
	}
	if(!(chan in global.randomColorsChosen)) {
		global.randomColorsChosen[chan] = {};
	}
	if(name in global.randomColorsChosen[chan]) {
		color = global.randomColorsChosen[chan][name];
	}
	else {
		color = global.defaultColors[Math.floor(Math.random()*global.defaultColors.length)];
		global.randomColorsChosen[chan][name] = color;
	}
	return color;
}

function procesar (user,linea)
{

	var hora = new Date();
	var nuevo = [];

	console.log(user.color);

	console.log(user);

	for(var i in user.emotes)
	{
		for(var x = 0; x < user.emotes[i].length; x++)
		{
			var temporal = new Object();
			var division = user.emotes[i][x].split("-");
			temporal.inicio= division[0];
			temporal.fin = division[1];
			temporal.codigo = i;
			nuevo[nuevo.length] = temporal;

		}
	}

	nuevo.sort(function(a,b){
		return (a.inicio-b.inicio);
	});

	var indice= 0;
	var mensajeRetocado = "";

	var scrollBajo = false;
	if($("#conversacion").scrollTop()+ $("#conversacion").height()== $("#conversacion")[0].scrollHeight)
	{
		scrollBajo = true;
	}else{
		scrollBajo = false;
	}

	for(var i = 0; i < nuevo.length;i++)
	{
		var adicionalImg = "";
		if(scrollBajo)
		{
			adicionalImg = "onload='cargaImagen()'";
		}


		mensajeRetocado += linea.substring(indice,parseInt(nuevo[i].inicio)-1)+" <img "+ adicionalImg+ " src='http://static-cdn.jtvnw.net/emoticons/v1/"+nuevo[i].codigo+"/1.0' />";		
		indice = parseInt(nuevo[i].fin)+1;

	}

	mensajeRetocado += linea.substring(indice);

	if($("#conversacion").scrollTop()+ $("#conversacion").height()== $("#conversacion")[0].scrollHeight)
	{
		$("#conversacion").append("<br \><div class='row fila'><div class='timeStamp'>"+hora.getHours()+":"+hora.getMinutes()+"</div><div class='nick' style='color: "+resolveColor(global.canal, user.username, user.color)+"'>"+user.username+"</div><div class='textoconv'><p>"+mensajeRetocado+"</p></div></div>");
		redimensionarH(null);

		$("#conversacion").scrollTop($("#conversacion")[0].scrollHeight);

	}else
	{
		$("#conversacion").append("<br \><div class='row fila'><div class='timeStamp'>"+hora.getHours()+":"+hora.getMinutes()+"</div><div class='nick' style='color: "+resolveColor(global.canal, user.username, user.color)+"'>"+user.username+"</div><div class='textoconv'><p>"+mensajeRetocado+"</p></div></div>");
		redimensionarH(null);
	}

	limitLines();

}


function limitLines()
{
	console.log($("#conversacion").children().length);
	if($("#conversacion").children().length > 200)
	{
		$("#conversacion").children()[0].remove();
		$("#conversacion").children()[0].remove();
	}
}

function cargaImagen()
{
	console.log("cargamos imagen");
	$("#conversacion").scrollTop($("#conversacion")[0].scrollHeight);
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

function autocompletar()
{
	var texto = $("#texto").val();
	var position = $("#texto").prop("selectionStart");

	var busqueda= "";
	for(var i = position-1; i > -1; i--)
	{
		if(texto.charAt(i) == ' ')
		{
			i = -1;
		}else
		{

			busqueda = texto.charAt(i) + busqueda;
		}
	}

	var result = search(global.userList[global.canal],busqueda);
	if(result.found)
	{

		var newone = texto.slice(0, position-busqueda.length);
		newone += result.text;

		$("#texto").val(newone);
	}
	

}


function search(lista, partial)
{
	var res = new Object();

	res.found = false


	for(var i = 0; !res.found && i < lista.length; i++)
	{


		if(compareStrings(lista[i],partial))
		{
			res.found = true;
			res.text = lista[i];
		}
	}

	return res;

}

function compareStrings(a, b)
{
	var res= true;
	for(var i = 0; res && i < a.length && i < b.length; i++)
	{
		if(a.charAt(i).toLowerCase() != b.charAt(i) && a.charAt(i).toUpperCase() != b.charAt(i))
		{
			res= false;
		}
	}

	return res;
}


function carga()
{


	loadEmotes();

	$(".btn").mouseup(function(){
		$(this).blur();
	})


	window.addEventListener('keydown',function(e){
		if(e.keyCode === 9 && $("#texto").is(":focus")){
			e.preventDefault();
			autocompletar();
		}
	});

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
		var addicional =0;
		if(global.win.isMaximizada)
		{
			addicional= 20;
		}
		redimensionarV(addicional);

	});


	$("#myModal").on('show.bs.modal', function(e)
	{
		$("#nick").val(localStorage.nick);
		$("#token").val(localStorage.token);
	});

	global.win.on('resize',function(width,height){
		var addicional =0;
		if(global.win.isMaximizada)
		{
			addicional= 15;
		}
		redimensionarV(0);
		redimensionarH(0);

	});
}

function unirse()
{
	if(global.conectado == true)
	{

		if(global.canalConectado == true)
		{
			global.client.part(global.canal);
			clearInterval(global.intervalo);
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



			global.https.get('https://tmi.twitch.tv/group/user/' + global.canal.toLowerCase() + '/chatters', function(res){




				var body1 = '';

				res.on('data', (chunk) => {
					body1 += chunk;

				});

				res.on('end', function(){
					var body = JSON.parse(body1);

					$("#nicks").empty();

					global.userList[global.canal] = body.chatters.moderators;
					for(var i = 0; i < body.chatters.moderators.length;i++){
						
						$("#nicks").append("<option class='moderador'>"+ body.chatters.moderators[i] +"</option>");
					}

					global.userList[global.canal] = global.userList[global.canal].concat(body.chatters.staff);
					for(var i = 0; i < body.chatters.staff.length;i++){
						
						$("#nicks").append("<option class='staff'>"+ body.chatters.staff[i] +"</option>");
					}

					global.userList[global.canal] = global.userList[global.canal].concat(body.chatters.admins);
					for(var i = 0; i < body.chatters.admins.length;i++){
						
						$("#nicks").append("<option class='staff'>"+ body.chatters.admins[i] +"</option>");
					}
					global.userList[global.canal] = global.userList[global.canal].concat(body.chatters.global_mods);
					for(var i = 0; i < body.chatters.global_mods.length;i++){
						
						$("#nicks").append("<option class='staff'>"+ body.chatters.global_mods[i] +"</option>");
					}

					global.userList[global.canal] = global.userList[global.canal].concat(body.chatters.viewers);
					for(var i = 0; i < body.chatters.viewers.length;i++){
						
						$("#nicks").append("<option class='viewers'>"+ body.chatters.viewers[i] +"</option>");
					}

					global.userList[global.canal] = global.userList[global.canal].concat(global.emotes);

					global.userList[global.canal].sort();


				});

			});



			global.intervalo = setInterval(function(){
				
				global.https.get('https://tmi.twitch.tv/group/user/' + global.canal.toLowerCase() + '/chatters', function(res){



					var body1 = '';

					res.on('data', (chunk) => {
						body1 += chunk;

					});

					res.on('end', function(){
						var body = JSON.parse(body1);

						$("#nicks").empty();

						global.userList[global.canal] = body.chatters.moderators;
						for(var i = 0; i < body.chatters.moderators.length;i++){

							$("#nicks").append("<option class='moderador'>"+ body.chatters.moderators[i] +"</option>");
						}

						global.userList[global.canal] = global.userList[global.canal].concat(body.chatters.staff);
						for(var i = 0; i < body.chatters.staff.length;i++){

							$("#nicks").append("<option class='staff'>"+ body.chatters.staff[i] +"</option>");
						}

						global.userList[global.canal] = global.userList[global.canal].concat(body.chatters.admins);
						for(var i = 0; i < body.chatters.admins.length;i++){

							$("#nicks").append("<option class='staff'>"+ body.chatters.admins[i] +"</option>");
						}
						global.userList[global.canal] = global.userList[global.canal].concat(body.chatters.global_mods);
						for(var i = 0; i < body.chatters.global_mods.length;i++){

							$("#nicks").append("<option class='staff'>"+ body.chatters.global_mods[i] +"</option>");
						}

						global.userList[global.canal] = global.userList[global.canal].concat(body.chatters.viewers);
						for(var i = 0; i < body.chatters.viewers.length;i++){

							$("#nicks").append("<option class='viewers'>"+ body.chatters.viewers[i] +"</option>");
						}

						global.userList[global.canal] = global.userList[global.canal].concat(global.emotes);

						global.userList[global.canal].sort();



					});

				});
			},60000);
		});



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
		global.win.isMaximizada = false;
	}else
	{
		global.win.maximize();
		global.win.isMaximizada = true;
	}
}


function enviar()
{
	if(global.conectado && global.canalConectado)
	{
		global.client.say(global.canal,$('#texto').val());
	}
	$("#texto").val("");
	$("#texto").focus();



}



function loadEmotes()
{
	global.https.get('https://twitchemotes.com/api_cache/v2/global.json', function(res){



		var body1 = '';

		res.on('data', (chunk) => {
			body1 += chunk;
		});

		res.on('end', function(){
			var body = JSON.parse(body1);
			global.emotes = Object.keys(body.emotes);

		});

	});


}


function conectar()
{

	localStorage.nick = $("#nick").val();
	localStorage.token = $("#token").val();

	console.log("prueba\n");





	var tmi = require("tmi.js");
	global.conectar = true;

	if(global.conectar)
	{
		var clientOptions = {
			options:
			{
				debug : true,
				emitSelf: true

			},
			identity: {
				username: localStorage.nick,
				password: localStorage.token
			},
			channels: []
		}


		console.log("prueba");

		global.client = new tmi.client(clientOptions);
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

		global.client.on('chat', function(channel,user,message)
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