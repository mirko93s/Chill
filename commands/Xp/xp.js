const Discord = require("discord.js");
const { fancyNumber } = require("../../functions");

module.exports = {
    name: "xp",
    category: "Xp",
    description: "Modify user's xp points",
    usage: "xp <mention> <give | take | set> <amount>\n**e.g**\n\`xp @mirko93s give 100\`\n> add 100 xp points to mirko93s\n\`xp @mirko93s take 50\`\n> remove 50 xp points from mirko93s\n\`xp @mirko93s set 25\`\n> set mirko93s' total xp points to 25 (set it to 0 to reset a member)\n> The level will be automatically updated on the next user's message",
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
			.setTitle(`⛔ Points can't be negative!`)
		if (!msg.member.hasPermission("ADMINISTRATOR")) return msg.channel.send(nopermEmbed).then(msg => msg.delete({timeout:5000}));
		let user = msg.mentions.users.first() || client.users.cache.get(arg[0]);
		if(!user) return msg.channel.send(noargsEmbed).then(msg => msg.delete({timeout:5000}));
		let mode = arg[1];
		if(!mode) return msg.channel.send(noargsEmbed).then(msg => msg.delete({timeout:5000}));
			else if(mode !== "take" && mode !== "give" && mode !== "set") return msg.channel.send(noargsEmbed).then(msg => msg.delete({timeout:5000}));
		let pointsToAdd = parseInt(arg[2], 10);
		if(arg[2] == 0) pointsToAdd = 0;
			else if (!pointsToAdd) return msg.channel.send(noargsEmbed).then(msg => msg.delete({timeout:5000}));

		client.xp.ensure(`${msg.guild.id}-${user.id}`, {
			user: user.id,
			guild: msg.guild.id,
			points: 0,
			level: 0
		});

		const key = `${msg.guild.id}-${user.id}`;
		let userscore = client.xp.get(key, "points");

		let xpmsg;
		if(mode == "give") {
			userscore += pointsToAdd;
			client.xp.set(key, userscore, "points");
			xpmsg = "+";
			let userlevel = Math.floor(0.3163 * Math.sqrt(userscore));
			client.xp.set(key, userlevel, "level");
		}		
		if(mode == "take") {
			if(userscore-pointsToAdd < 0) return msg.channel.send(nonegativeEmbed).then(msg => msg.delete({timeout:5000}));
			userscore -= pointsToAdd;
			client.xp.set(key, userscore, "points");
			xpmsg = "+";
			let userlevel = Math.floor(0.3163 * Math.sqrt(userscore));
			client.xp.set(key, userlevel, "level");
		}
		if(mode == "set") {
			userscore = pointsToAdd;
			client.xp.set(key, userscore, "points");
			xpmsg = "Set to";
			let userlevel = Math.floor(0.3163 * Math.sqrt(userscore));
			client.xp.set(key, userlevel, "level");
		}
		const xpcmdembed = new Discord.MessageEmbed()
			.setColor(`RANDOM`)
			.setAuthor(user.username, user.avatarURL())
			.setTitle(`${xpmsg} ${fancyNumber(pointsToAdd)} points`)
			.setDescription(`by ${msg.author.username}`)
		return msg.channel.send(xpcmdembed);

    }
}
