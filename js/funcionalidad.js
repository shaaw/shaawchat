
global.gui = require("nw.gui");
global.nw.require('./lib/consoleHack')(console);
//global.gui.Window.get().showDevTools();
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

global.badgesTrans = {};

global.badgesTrans['moderator'] = 'mod';
global.badgesTrans['subscriber'] = 'subscriber';
global.badgesTrans['broadcaster'] = 'broadcaster';
global.badgesTrans['staff'] = 'staff';
global.badgesTrans['global_mod'] = 'global_mod';
global.badgesTrans['admin'] = 'admin';
global.badgesTrans['turbo'] = 'turbo';


global.randomColorsChosen = {};

// global.irc = require("tmi.js");



//global.database = require("./lib/database.js");

global.conectado = false;
global.canalLinks = {};
global.canales= [];
global.canalActual ="";

global.buffer = "";


function systemMsg(canal,user,msg)
{
	$("#" +canal+ " .conversacion").append("<br \><div class='row fila'><div class='nick'>"+user+"</div><div class='textoconv'><p>"+msg+"</p></div></div>");
}


function petition(url)
{
	return new Promise(function(resolve, reject) {
		global.https.get(url, function(res){

			var body1 = '';

			res.on('data', (chunk) => {
				body1 += chunk;

			});

			res.on('end', function(){
				var body = JSON.parse(body1);

				resolve(body);

			});
			res.on('error',function()
			{
				reject(Error("fallo peticion"));
			});

		});
	});

}

/*
function joinBot()
{
	if(global.canalActual)
	{
		var tmi = require("tmi.js");
		var config = require("./config/credentials.json");
		global.comandos = require("./config/comands.json");
		var clientOptions = {
			options:
			{
				debug : true,
				emitSelf: true

			},
			identity: {
				username: config.username,
				password: config.token
			},
			channels: [global.canalActual]
		}
	}

	global.bot = new tmi.client(clientOptions);

	global.bot.addListener('connectfail', function () {
		alert("fallo");
	});

	global.bot.addListener('crash', function (message, stack) {
		alert(message+" "+stack);
	});

	global.bot.on('chat', function(channel,user,message)
	{	
		var split  = message.split(" ");
		if(split[0] == "!"+config.currencyName)
		{	
			var usuario = user.username;
			if(split[1])
			{
				usuario = split[1];
			}
			global.database.getCurrency(usuario,global.canal).then(function(userDatabase){				
				global.bot.say(global.canal,""+usuario+" has "+userDatabase.get('currency')+" "+config.currencyName);
			}, function(reason){
				console.log(reason);
				global.bot.say(global.canal,""+usuario+" doesn't have "+config.currencyName+" yet");
			});

		}else if(split[0] == "!add" )
		{	
			if(user.mod==true || user.badges['broadcaster'])
			{
				if(split[1] && split[2])
				{
					var posicion = message.indexOf(" ",split[0].length+split[1].length);
					split[2] = message.substring(posicion+1);

					global.comandos[split[1]] = split[2];
					var fs = require('fs');
					fs.writeFile("./config/comands.json",JSON.stringify(global.comandos),(err) =>
					{
						if(err) throw err;
						console.log("comands saved");

					});
					global.bot.say(global.canal, "Command "+split[1]+ " added");
				}
			}
		}else if(split[0] == "!delete")
		{	
			if(user.mod==true || user.badges['broadcaster'])
			{
				if(split[1])
				{

					delete global.comandos[split[1]];
					var fs = require('fs');
					fs.writeFile("./config/comands.json",JSON.stringify(global.comandos),(err) =>
					{
						if(err) throw err;
						console.log("comands saved");

					});
					global.bot.say(global.canal, "Command "+split[1]+ " deleted");
				}
			}
		}else if(global.comandos[split[0]])
		{
			global.bot.say(global.canal, global.comandos[split[0]]);
		}

	});	

	global.bot.connect().then(function()
	{

		systemMsg("Bot","Connected");

	});
}

*/

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


function popOutMenu(ev)
{
	ev.preventDefault();

	console.log(ev);

	var user = $(ev.target).text();
	var user = user.substring(0,user.length-3);
	console.log(user);
	var menu = new global.gui.Menu();
	menu.append(new global.gui.MenuItem({label: user}));
	menu.append(new global.gui.MenuItem({ type: 'separator' }));
	menu.append(new global.gui.MenuItem({ label: 'Timeout (1sg)', click: function(){
		global.client.timeout(global.canalActual,user,1,null);
	} }));
	menu.append(new global.gui.MenuItem({ label: 'Timeout (10sg)', click: function(){
		global.client.timeout(global.canalActual,user,10,null);
	} }));
	menu.append(new global.gui.MenuItem({ label: 'Timeout (5m)', click: function(){
		global.client.timeout(global.canalActual,user,300,null);
	} }));
	menu.append(new global.gui.MenuItem({ label: 'Ban', click: function(){
		global.client.ban(global.canalActual,user,null);
	} }));
	menu.append(new global.gui.MenuItem({ type: 'separator' }));
	menu.append(new global.gui.MenuItem({ label: 'Mod/Unmod', click: function(){
		if(global.client.isMod(global.canalActual,user))
		{
			global.client.unmod(global.canalActual,user);
		}else{
			global.client.mod(globalActual.canal,user);
		}
	} }));

	menu.popup(ev.clientX,ev.clientY);


}

function procesar (canal,user,linea)
{

	var hora = new Date();
	var nuevo = [];

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
	if($("#" +canal+ " .conversacion").scrollTop()+ $("#" +canal+ " .conversacion").height()== $("#" +canal+ " .conversacion")[0].scrollHeight)
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
			adicionalImg = "onload='cargaImagen(event)'";
		}


		mensajeRetocado += linea.substring(indice,parseInt(nuevo[i].inicio)-1)+" <img class='emote"+canal +"'' " + adicionalImg+ " src='http://static-cdn.jtvnw.net/emoticons/v1/"+nuevo[i].codigo+"/1.0' />";		
		indice = parseInt(nuevo[i].fin)+1;

	}
	var textBadges = "";

	if(user.badges != null)
	{
		var badges = Object.keys(user.badges);


		for(var i = 0; i < badges.length;i++)
		{
			var adicionalImg = "";
			/*
			if(scrollBajo)
			{
				adicionalImg = "onload='cargaImagen(event)'";
			}*/
			if(global.canalLinks[canal][global.badgesTrans[badges[i]]]){

				textBadges += "<img "+ adicionalImg+ " src='"+ global.canalLinks[canal][global.badgesTrans[badges[i]]].image+ "' />";
			}	
		}
	}

	mensajeRetocado += linea.substring(indice);
	

	if($("#" +canal+ " .conversacion").scrollTop()+ $("#" +canal+ " .conversacion").height()== $("#" +canal+ " .conversacion")[0].scrollHeight)
	{
		$("#" +canal+ " .conversacion").append("<br \><div class='row fila'><div class='timeStamp'>"+hora.getHours()+":"+hora.getMinutes()+"</div><div class='textoconv' >"+ textBadges+" <b class='nick' style='color: "+resolveColor(global.canal, user.username, user.color)+"'>"+user.username+":  </b><div class='mensaje'>"+mensajeRetocado+"</div></div>");
		redimensionarH(0);

		$("#" +canal+ " .conversacion").scrollTop($("#" +canal+ " .conversacion")[0].scrollHeight);
	/*	$(".emotes"+canal).unbind();
	$(".emotes"+canal).load(cargaImagen);*/


}else
{
	$("#" +canal+ " .conversacion").append("<br \><div class='row fila'><div class='timeStamp'>"+hora.getHours()+":"+hora.getMinutes()+"</div><div class='textoconv'>"+ textBadges+" <b class='nick' style='color: "+resolveColor(global.canal, user.username, user.color)+"'>"+user.username+":  </b> <div  class='mensaje'>"+mensajeRetocado+"</div></div>");
	redimensionarH(0);
}

$( ".nick" ).unbind();
$(".nick").contextmenu(function (ev)
{
	popOutMenu(ev);
});
limitLines(canal);

}


function limitLines(canal)
{

	if($("#"+canal+" .conversacion").children().length > 200)
	{
		$("#"+canal+" .conversacion").children()[0].remove();
		$("#"+canal+" .conversacion").children()[0].remove();
	}
}

function cargaImagen(canal)
{

//	console.log(canal.target);

var conversacion =  $(canal.target).parent().parent().parent().parent();

conversacion.scrollTop(conversacion[0].scrollHeight);
//	console.log("cargamos imagen");
}

function redimensionarH(valor)
{

	var tamano2 = $("#tabContent").width()*0.75;
	$(".textoconv").width(tamano2+"px");
}

function redimensionarV(valor)
{

	var tamano = global.win.height-25-26-72-valor;
	$(".conversacion").height(tamano+"px");

	$(".nicks").height((tamano-20)+ "px");
}

function autocompletar(canal)
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
	console.log(global.userList[canal]);
	var result = search(global.userList[canal],busqueda);
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
	//global.database.cargar();

	if(global.nw.App.argv[1] == "dev")
	{
		global.env = "dev";
	}

	if(global.env == 'dev')
	{
		global.gui.Window.get().showDevTools();
	}else{
		console.log(global.nw.App.manifest['version']);
	}




	
	loadEmotes();

	$(".btn").mouseup(function(){
		$(this).blur();
	})


	window.addEventListener('keydown',function(e){

		if(e.keyCode === 9 && e.ctrlKey && $("#texto").is(":focus")){
			
			if(global.conectado && global.canalActual){
				
				var position = global.canales.indexOf(global.canalActual);


				if(e.shiftKey)
				{
					position--;
				}else
				position++;

				if(position >= global.canales.length)
				{
					position = 0;
				}

				if(position < 0)
				{
					position = global.canales.length-1;
				}

				$("#tab"+global.canales[position]).tab("show");
				global.canalActual = global.canales[position];

			}
		}else if(e.keyCode === 9 && $("#texto").is(":focus")){
			if(global.conectado && global.canalActual)
			{

				
				e.preventDefault();
				autocompletar(global.canalActual);
			}
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
        if(keynum == 9 && event.cntrlKey)
        {
        	console.log("control tab");
        }else if(keynum== 13 && $("#texto").is(":focus"))		
        {		
        	enviar();		
        }

        if(keynum== 13 && $("#canal").is(":focus"))
        {
        	unirse();
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

	$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
		  var target = $(e.target).attr("href"); // activated tab

		  console.log(target);
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



function anyadirAlselector(canal,lista,iteracion)
{

	if(iteracion < lista.length)
	{
		//console.log("llamamos al siguiente");
		$("#"+canal+ " .nicks").append("<option class='viewers'>"+ lista[iteracion] +"</option>");

		setTimeout(anyadirAlselector(canal,lista,iteracion+1),0);
	}
}


function unirse()
{
	if(global.conectado == true)
	{
		var canal = $('#canal').val().toLowerCase();
		global.client.join(canal).then(function(userstate){

			
			console.log(userstate);
			global.canales.push($('#canal').val());
			

			
			var hora = new Date()

			global.canalActual=canal;
			

			$("#tabsCanales").append('<li class="tabCanal" role="presentation" ><a id="tab'+global.canalActual+'" href="#'+global.canalActual+'" aria-controls="'+global.canalActual+'" role="tab" data-toggle="tab">'+global.canalActual+'</a></li>');
			$("#tabContent").append('<div role="tabpanel" class="tab-pane" id="'+global.canalActual+'">	<div class="col-xs-10"><div id="texto'+global.canalActual+'" class="conversacion"></div></div><div class="col-xs-2"><select multiple id="nicks'+global.canalActual+'" name="nicks" class="nicks" class="form-control"></select></div>');
			
			$("#texto"+global.canalActual).append("<div class='row fila'><div class='timeStamp'>"+hora.getHours()+":"+hora.getMinutes()+"</div><div class='textoconv' > <b class='nick' style='color:blue '>"+"System"+":  </b><div class='mensaje'>"+"Joined Channel"+"</div></div>");
			
			redimensionarV(0);
			redimensionarH(0);
			

			var anyadir = ""

			$("#leave").removeAttr('disabled');
			$("#tab"+global.canalActual).tab("show");

			$(".tabCanal a").unbind();

			$(".tabCanal a").on("click",function (e){
				var target = $(e.target).attr("href") // activated tab
				global.canalActual = target.substring(1);
			});

			global.userList[canal] = [];
			var oboe = require('oboe');

			oboe('https://tmi.twitch.tv/group/user/' + canal.toLowerCase() + '/chatters')

			.node('moderators[*]', function( moderator ){

				anyadir+= "<option class='moderador'>"+ moderator +"</option>";

			})
			.node('viewers.*', function( viewer ){
				anyadir += "<option class='viewers'>"+ viewer +"</option>";

			})
			.node("chatter_count", function (argument) {
				if(argument > 5000)
				{
					console.log("cancelamos");
					this.abort();
				}
			})  
			.done(function(result){

				global.userList[canal] = result.chatters.moderators;
				global.userList[canal] = global.userList[canal].concat(result.chatters.staff);
				global.userList[canal] = global.userList[canal].concat(result.chatters.admins);
				global.userList[canal] = global.userList[canal].concat(result.chatters.global_mods);
				global.userList[canal] = global.userList[canal].concat(result.chatters.viewers);

				$("#"+canal+" .nicks").empty();

				$("#"+canal+ " .nicks").append(anyadir);
				

				$( "#"+canal+ " .nicks option" ).unbind();
				$( "#"+canal+ " .nicks option").contextmenu(function (ev)
				{
					$(ev.target).prop('selected',true);
					popOutMenu(ev);
				});
				
				global.userList[canal] = global.userList[canal].concat(global.emotes);

				global.userList[canal].sort();

				/*
				global.userList[canal] = result.chatters.moderators;
				var moderators = ""
				for(var i = 0; i < result.chatters.moderators.length;i++){

					moderators+= "<option class='moderador'>"+ result.chatters.moderators[i] +"</option>";
				}

				$("#"+canal+ " .nicks").append(moderators);
				global.userList[canal] = global.userList[canal].concat(result.chatters.staff);
				for(var i = 0; i < result.chatters.staff.length;i++){

					$("#"+canal+ " .nicks").append("<option class='staff'>"+ result.chatters.staff[i] +"</option>");
				}

				global.userList[canal] = global.userList[canal].concat(result.chatters.admins);
				for(var i = 0; i < result.chatters.admins.length;i++){

					$("#"+canal+ " .nicks").append("<option class='staff'>"+ result.chatters.admins[i] +"</option>");
				}
				global.userList[canal] = global.userList[canal].concat(result.chatters.global_mods);
				for(var i = 0; i < result.chatters.global_mods.length;i++){

					$("#"+canal+ " .nicks").append("<option class='staff'>"+ result.chatters.global_mods[i] +"</option>");
				}

				global.userList[canal] = global.userList[canal].concat(result.chatters.viewers);
				

		//		anyadirAlselector(canal,result.chatters.viewers,0);

				var viewers = "";

				for(var i = 0; i < result.chatters.viewers.length;i++){

					viewers += "<option class='viewers'>"+ result.chatters.viewers[i] +"</option>";
				}
				$("#"+canal+ " .nicks").append(viewers);

				global.userList[canal] = global.userList[canal].concat(global.emotes);

				global.userList[canal].sort();

				$( "#"+canal+ " .nicks option" ).unbind();
				$( "#"+canal+ " .nicks option").contextmenu(function (ev)
				{
					$(ev.target).prop('selected',true);
					popOutMenu(ev);
				});
				*/
				

			});

			

			
			petition('https://api.twitch.tv/kraken/chat/' + canal.toLowerCase() +'/badges').then(function(result){

				global.canalLinks[canal] = result;
			});





			global.intervalo = setInterval(function(){


				anyadir = "";

				var oboe = require('oboe');

				oboe('https://tmi.twitch.tv/group/user/' + canal.toLowerCase() + '/chatters')
				.node('chatter_count', function (dato) {
					if(data > 10000)
					{
						this.abort();
					}
				})
				.node('moderators[*]', function( moderator ){

					anyadir+= "<option class='moderador'>"+ moderator +"</option>";

				}).node('viewers.*', function( viewer ){
					anyadir += "<option class='viewers'>"+ viewer +"</option>";

				}).node("chatter_count", function (argument) {
					console.log(argument);
					if(argument > 5000)
					{
						console.log("cancelamos");
						this.abort();
					}
				}) 
				.done(function(result){

					global.userList[canal] = result.chatters.moderators;
					global.userList[canal] = global.userList[canal].concat(result.chatters.staff);
					global.userList[canal] = global.userList[canal].concat(result.chatters.admins);
					global.userList[canal] = global.userList[canal].concat(result.chatters.global_mods);
					global.userList[canal] = global.userList[canal].concat(result.chatters.viewers);

					$("#"+canal+" .nicks").empty();

					$("#"+canal+" .nicks").append(anyadir);
					
					$( "#"+canal+ " .nicks option" ).unbind();
					$( "#"+canal+ " .nicks option").contextmenu(function (ev)
					{
						$(ev.target).prop('selected',true);
						popOutMenu(ev);
					});

					global.userList[canal] = global.userList[canal].concat(global.emotes);

					global.userList[canal].sort();

				});

				

			},60000);
			
		}).catch(function(err) {

			console.log(err);
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
	if(global.conectado && global.canalActual)
	{
		global.client.say(global.canalActual,$('#texto').val());
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
			console.log(global.emotes);

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



		});

		global.client.on('chat', function(channel,user,message)
		{

			procesar(channel.substring(1),user,message);

		});	
/*
		global.client.on('timeout', function(channel,user,reason,duration)
		{

			systemMsg(channel.substring(1),"System", user+ " has been timeout for "+ duration +" seconds");

		});	
		*/


	}
	$("#myModal").modal('hide');
}

function abrirBrowser()
{

	global.gui.Shell.openExternal("http://twitchapps.com/tmi/");

}

function leave() {

	global.client.part(global.canalActual).then(function (argument) {


		console.log("salimos del canal");
		var position = global.canales.indexOf(global.canalActual);		

		var canalABorrar = global.canalActual;

		var positionantigua = position;

		position--;

		if(position >= global.canales.length)
		{
			position = 0;
		}

		if(position < 0)
		{
			position = global.canales.length-1;
		}

		$("#tab"+global.canales[position]).tab("show");
		global.canalActual = global.canales[position];


		console.log(canalABorrar);
		$("#tab"+canalABorrar).parent().remove();
		$("#"+canalABorrar).remove();
		global.canales.splice(positionantigua,1);

		console.log(global.canales.length);
		if(global.canales.length == 0)
		{
			$("#leave").attr('disabled','disabled');
		}



		console.log("salir del canal "+argument);
	});
	

}

