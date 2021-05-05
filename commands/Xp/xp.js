const Discord = require("discord.js");
const { fancyNumber } = require("../../functions");

module.exports = {
    name: "xp",
    category: "Xp",
    description: "Modify user's xp points",
    usage: "xp <mention> <give | take | set> <amount>\n**e.g**\n\`xp @mirko93s give 100\`\n> adds 100 xp points to mirko93s\n\`xp @mirko93s take 50\`\n> removes 50 xp points from mirko93s\n\`xp @mirko93s set 25\`\n> set mirko93s' xp points to 25 (set it to 0 to reset a member)\n> The level will be automatically updated and level rewards given or taken based on the new points",
    permission: "ADMINISTRATOR",
    run: async (client, msg, arg) => {
		
		const nopermEmbed = new Discord.MessageEmbed()
			.setColor(`RED`)
			.setTitle(`⛔ You don't have permission to use this!`)
		const noargsEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
			.setTitle(`⛔ Please mention a valid user of this server and provide mode and amount.`)
		const nonegativeEmbed = new Discord.MessageEmbed()
			.setColor(`RED`)
			.setTitle(`⛔ User points can't go negative!`)
		const moduleDisabledEmbed = new Discord.MessageEmbed()
			.setColor(`RED`)
			.setTitle(`⛔ This module is disabled on this server!`)

		if (!msg.member.hasPermission("ADMINISTRATOR")) return msg.channel.send(nopermEmbed).then(msg => msg.delete({timeout:5000}));
		if (client.settings.get(msg.guild.id, "xpmodule") === "false") return msg.channel.send(moduleDisabledEmbed).then(msg => msg.delete({timeout:5000}));
		let user = msg.mentions.users.first() || client.users.cache.get(arg[0]);
		if(!user) return msg.channel.send(noargsEmbed).then(msg => msg.delete({timeout:5000}));
		let mode = arg[1];
		if(!mode) return msg.channel.send(noargsEmbed).then(msg => msg.delete({timeout:5000}));
			else if(mode !== "take" && mode !== "give" && mode !== "set") return msg.channel.send(noargsEmbed).then(msg => msg.delete({timeout:5000}));
		let pointsToAdd = parseInt(arg[2], 10);
		if(arg[2] == 0) pointsToAdd = 0;
			else if (!pointsToAdd || pointsToAdd < 1) return msg.channel.send(noargsEmbed).then(msg => msg.delete({timeout:5000}));

		client.settings.ensure(msg.guild.id, {level: 0, points: 0}, `xp.${user.id}`);	

		let userScore = client.settings.get(msg.guild.id, `xp.${user.id}`);		
		if(mode == "give") {
			var newPoints = userScore.points + pointsToAdd;			
			var xpmsg = "+";		
		}		
		if(mode == "take") {
			if(userScore.points-pointsToAdd < 0) return msg.channel.send(nonegativeEmbed).then(msg => msg.delete({timeout:5000}));
			var newPoints = userScore.points - pointsToAdd;		
			var xpmsg = "-";		
		}
		if(mode == "set") {
			var newPoints = pointsToAdd;		
			var xpmsg = "Set to";		
		}
		let newLevel = Math.floor(0.3163 * Math.sqrt(newPoints));
		//check for level rewards to give or take
		var rewards = client.settings.get(msg.guild.id, `rewards`);
		var unlocked = "";
		if (newLevel > userScore.level) {
			for (const [key, value] of Object.entries(rewards)) {
				if (value <= newLevel && value > userScore.level) {
					const checkrole = msg.guild.roles.cache.find(r => r.id === key); //check if role exists
					if (checkrole && msg.guild.me.roles.highest.position > checkrole.rawPosition) { //give role checking hierarchy
						msg.member.roles.add(checkrole.id);
						unlocked += `${msg.guild.roles.cache.find(r => r.id === key).name}\n`;
					}
				}
			};
		} else if (newLevel < userScore.level) {
			for (const [key, value] of Object.entries(rewards)) {
				if (value <= userScore.level && value > newLevel) {
					const checkrole = msg.guild.roles.cache.find(r => r.id === key); //check if role exists
					if (checkrole && msg.guild.me.roles.highest.position > checkrole.rawPosition) { //remove role checking hierarchy
						msg.member.roles.remove(checkrole.id);
						unlocked += `${msg.guild.roles.cache.find(r => r.id === key).name}\n`;
					}
				}
			};
		}
		
		client.settings.set(msg.guild.id, {level: newLevel, points: newPoints}, `xp.${user.id}`);
		const xpEmbed = new Discord.MessageEmbed()
			.setColor(`RANDOM`)
			.setAuthor(`${user.username}'s experience`, user.avatarURL())
			.setTitle(`${xpmsg} **${fancyNumber(pointsToAdd)}** point${pointsToAdd > 1 || pointsToAdd == 0 ? "s" : ""}`)
			.setFooter(`by ${msg.author.username}`)

		if (newLevel != userScore.level) xpEmbed.setTitle(`**${xpmsg} ${fancyNumber(pointsToAdd)} points**\n*New level is: ${newLevel}*`)
		if (unlocked.length > 0) {
			if (newLevel > userScore.level) xpEmbed.setDescription(`***Unlocked roles:\n${unlocked}***`)
			else if (newLevel < userScore.level) xpEmbed.setDescription(`***Taken roles:\n${unlocked}***`)
		}

		return msg.channel.send(xpEmbed);

    }
}