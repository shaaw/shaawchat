

function conectar()
{
	console.log("no llega");

	localStorage.nick = $("#nick").val();
	localStorage.token = $("#token").val();

	global.conectar = true;
	global.nueva.close();
}

function cancelar()
{

	global.conectar = false;
	global.nueva.close();
}


function abrirBrowser()
{
	var gui = require("nw.gui");
	gui.Shell.openExternal("http://twitchapps.com/tmi/");

}

function cargar()
{
	global.nueva.show();
	$("#nick").val(localStorage.nick);
	$("#token").val(localStorage.token);
}