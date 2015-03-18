var gui = require("nw.gui");
var win = gui.Window.get();
win.isMaximizada = false;

function carga()
{
	win.on("maximize",function()
	{
		win.isMaximizada = true;
	});
	win.on("unmaximize",function()
	{
		win.isMaximizada = false;
	});
	win.on('resize',function(width,height){
		var tamano = win.height-26-72;
		tamano= tamano+"px";
		console.log(tamano);
		document.getElementById("conversacion").style.height=tamano;
	});
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