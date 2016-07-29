var exports = module.exports = {};

var Sequelize = require("sequelize");
var sequelize = new Sequelize('db','','', {
	dialect:'sqlite', 
	storage:'./lib/db.sqlite',
});


users = sequelize.define('users', {
	channel: {
		type: Sequelize.STRING,
		allowNull: false,
		primaryKey: true
	},
	user: {
		type: Sequelize.STRING,
		allowNull: false,
		primaryKey: true
	},
	currency: {
		type: Sequelize.INTEGER,
		allowNull: false
	}
});


exports.cargar = function (){
	users.sync();
}

exports.periodic = function (userList, canal)
{
	for(var i = 0; i < userList.length; i++)
	{
		exports.incrementOrCreate(userList[i],canal);
	}


}


exports.incrementOrCreate = function(user, canal)
{

	users.findOrCreate({
		where: {
			channel : canal,
			user: user
		},
		defaults: {
			currency: 100
		}
	}).spread(function(user, created)
	{
		console.log(user.get({
			plain: true
		}));
		console.log(created);

		if(!created)
		{
			user.increment('currency',{by: 10}).then(function (){
				console.log("incremented");
			});
		}
	});
}


exports.getCurrency = function(user,canal)
{
	return new Promise(function(resolve,reject){
		users.findOne({where: {
			channel : canal,
			user: user
		}}).then(function(user){
			if(user){
				resolve(user);
			}else{
				console.log("rejected");
				reject("doesnt exist");
			}
		});
	})
}