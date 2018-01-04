const Eris = require("eris");

var fs = require('fs');

var strikeList;
var login = require('./login.json');

var roles = require('./roles.json');
var probation = require('./probation.json');

var bot = new Eris(login.token);

bot.on("ready", () => {

	console.log("Bot ready");

});

bot.on("messageCreate", (msg) => {

  if(msg.content.startsWith('!color')) {
  	var colorRole = msg.content.split(' ');
  	var existingRoles = [];
  	var colorId;

  	if(colorRole.length < 2) {
  		msg.channel.createMessage('Please enter a color');
  	} else if(!roles.colorRoles.includes(colorRole[1])){
  		msg.channel.createMessage('Please enter a valid color');
  	} else {
  		msg.channel.guild.roles.forEach((item, key, mapObj) => {
  			if(item.name === colorRole[1]) {
  				colorId = item.id;
  			}
  		});

  		msg.member.roles.forEach((item, index) => {
  			if(!roles.colorRoles.includes(msg.channel.guild.roles.get(item).name)) {
  				existingRoles.push(item);
  			}
  		});

  		msg.member.edit({"roles":existingRoles}).then(
  			(val) => {
  				msg.member.addRole(colorId).then(
  					(val) => {
  						msg.channel.createMessage(msg.member.mention + ' ' + colorRole[1] + ' has been added');
  					}).catch(
  					(reason) => {
  						msg.channel.createMessage("An error has occured adding the new color");
  						console.log(reason);
  					});
  			}).catch(
  			(reason) => {
  				msg.channel.createMessage("An error occurred removing old colors");
  				console.log(reason);
  			});
  	}
  }

  if(msg.content.startsWith("!timezone")) {
  	var regionRole = msg.content.split(' ');
  	var existingRoles = [];
  	var regionId;

  	if(regionRole.length < 2) {
  		msg.channel.createMessage('Please enter a timezone');
  	} else if(!roles.regionRoles.includes(regionRole[1])) {
  		msg.channel.createMessage('Please enter a valid timezone.');
  	} else {
  		msg.channel.guild.roles.forEach((item, key, mapObj) => {
  			if(item.name === regionRole[1]) {
  				regionId = item.id;
  			}
  		});

  		msg.member.roles.forEach((item, index) => {
  			if(!roles.regionRoles.includes(msg.channel.guild.roles.get(item).name)) {
  				existingRoles.push(item);
  			}
  		});

  		msg.member.edit({"roles":existingRoles}).then(
  			(val) => {
  				msg.member.addRole(regionId).then(
					(val) => {
  						msg.channel.createMessage(msg.member.mention + ' ' + regionRole[1] + ' has been added');
					}).catch(
					(reason) => {
						msg.channel.createMessage("An error has occured adding the new Timezone");
  						console.log(reason);
					});
  			}).catch(
  			(reason) => {
  				msg.channel.createMessage("An error occured removing old Timezones");
  				console.log(reason);
  			});
  	}
  }

  if(msg.content.startsWith("!main")) {
  	var mainRole = msg.content.split(' ');
  	var existingRoles = [];
  	var mainId;

  	if(mainRole.length < 2) {
  		msg.channel.createMessage('Please enter a character');
  	} else {
  		mainRole[1] += 'Main';
  		if(!roles.mainRoles.includes(mainRole[1])){
  			msg.channel.createMessage('Please enter a valid character');
  		} else {
  			msg.channel.guild.roles.forEach((item, key, mapObj) => {
  				if(item.name === mainRole[1]) {
  					mainId = item.id;
  				}
  			});

  			msg.member.roles.forEach((item, index) => {
  				if(!roles.mainRoles.includes(msg.channel.guild.roles.get(item).name)) {
  					existingRoles.push(item);
  				}
  			});

  			msg.member.edit({"roles":existingRoles}).then(
  			(val) => {
  				msg.member.addRole(mainId).then(
  					(val) => {
  						msg.channel.createMessage(msg.member.mention + ' ' + mainRole[1] + ' has been added');
  					}).catch(
  					(reason) => {
  						msg.channel.createMessage("An error has occured adding the new main role");
  						console.log(reason);
  					});
  			}).catch(
  			(reason) => { 

  				msg.channel.createMessage("An error occured removing old main");
  				console.log(reason);
  			})

  		}
  	}
  }

  if(msg.content.startsWith("!mute")) {
  	var modId;
  	msg.channel.guild.roles.forEach((item, key, mapObj) => {
  		if(item.name === "Moderator") {
  			modId = item.id;
  		}
  	});

  	if(msg.member.roles.indexOf(modId) !== -1) {
  		if(msg.mentions.length > 0) {
  			var count = 0;
  			msg.mentions.forEach((item, key) => {
  				msg.channel.editPermission(item.id, 0, 2048, "member", "Muted through bot command by " + msg.author.username).then(
	  			(val) => {
	  				count++;
	  				if(count === msg.mentions.length) {
	  					var mentionString = '';
	  					msg.mentions.forEach((item, index) => {
	  						mentionString += item.mention + ' ';
	  					});
	  					msg.channel.createMessage(mentionString + (count === 1 ? ' has been ' : ' have been ') + 'muted here.');
	  				}
	  				console.log(val);
	  			});
  			});

  		} else {
  			msg.channel.createMessage("Please mention the users to be muted");
  		}
  	} else {
  		msg.channel.createMessage("You do not have permission to use this command");
  	}
  }

});

bot.on("guildMemberUpdate", (guild, member, oldMember, oldRoles, oldNick) => {
	var newRoles = member.roles;
	var probationId;
	guild.roles.forEach((item, key, mapObj) => {
		if(item.name === "Probation") {
			probationId = item.id;
		}
	});

	if(!member.roles.has(probationId) && oldRoles.has(probationId)) {
		if(probation[member.Id] === undefined || probation[member.Id] === {}) {
			probation[member.Id] = {
				"persistentRoles": [probationId]
			}
		} else if(probation[member.Id].persistentRoles === undefined || probation[member.Id].persistentRoles === []) {
			probation[member.Id].persistentRoles = [probationId];
		} else {
			probation[member.Id].persistentRoles.push(probationId);
		}
	} else if(member.roles.has(probationId) && !oldRoles.has(probationId)) {
		if(probation[member.Id].persistentRoles.indexOf(probationId) !== -1) {
			var roleIndex = probation[member.Id].persistentRoles.indexOf(probationId);
			probation[member.Id].persistentRoles.splice(roleIndex, 1);
		}
	}

	fs.writeFile('./probation.json', JSON.stringify(probation), 'utf8', (err, data) => {
		if(err !== null) {
			console.log(err);
		}
	});

});



/*bot.on("guildMemberAdd", (guild, member) => {
	var modChat = guild.channels.find((cur) => {
		if(cur.name.toLowerCase() === 'mods_only')
			return true;
		return false;
	});

	modChat.createMessage(member.Name + " has just joined the server.");

});*/

bot.connect();
