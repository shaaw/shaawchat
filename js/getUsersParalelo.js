
var cluster= require('cluster');
var fs = require('fs');
var http = require("http");

var numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  // Fork workers.
  for (var i = 0; i < numCPUs; i++) {
  	cluster.fork();
  }

  Object.keys(cluster.workers).forEach(function(id) {
  	console.log("I am running with ID : "+cluster.workers[id].process.pid);
  });

  cluster.on('exit', function(worker, code, signal) {
  	console.log('worker ' + worker.process.pid + ' died');
  });
} else {
	for(i= 0;  i < 1000000; i++)
	{
		console.log
	}
}
