const Discord = require("discord.js");
const SQLite = require("better-sqlite3");
const sql = new SQLite('./xp_database/scores.sqlite');
getScore = sql.prepare("SELECT * FROM scores WHERE user = ? AND guild = ?");
setScore = sql.prepare("INSERT OR REPLACE INTO scores (id, user, guild, points, level) VALUES (@id, @user, @guild, @points, @level);");

module.exports = {
    name: "xp",
    category: "Xp",
    description: "Modify user's xp points",
    usage: "xp <mention> <give | take | set> <amount>\n**e.g**\n\`xp @mirko93s give 100\`\n> add 100 xp points to mirko93s\n\`xp @mirko93s take 50\`\n> remove 50 xp points from mirko93s\n\`xp @mirko93s set 25\`\n> set mirko93s' total xp points to 25 (set it to 0 to reset a member)\n> The level will be automatically updated on the next user's message",
    permission: "ADMINISTRATOR",
    run: async (client, msg, arg) => {
        msg.delete();
		const nopermEmbed = new Discord.MessageEmbed()
			.setColor(`RED`)
			.setTitle(`⛔ You don't have permission to use this!`)
		const noargsEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
			.setTitle(`⛔ Please mention a valid user of this server and provide mode and amount.`)
		const nonegativeEmbed = new Discord.MessageEmbed()
			.setColor(`RED`)
			.setTitle(`⛔ Points can't be negative!`)
		if (!msg.member.hasPermission("ADMINISTRATOR")) return msg.channel.send(nopermEmbed).then(m => m.delete({timeout:5000}));
		let user = msg.mentions.users.first() || client.users.cache.get(arg[0]);
		if(!user) return msg.channel.send(noargsEmbed).then(m => m.delete({timeout:5000}));
		let mode = arg[1];
		if(!mode) return msg.channel.send(noargsEmbed).then(m => m.delete({timeout:5000}));
			else if(mode !== "take" && mode !== "give" && mode !== "set") return msg.channel.send(noargsEmbed).then(m => m.delete({timeout:5000}));
		let pointsToAdd = parseInt(arg[2], 10);
		if(arg[2] == 0) pointsToAdd = 0;
			else if (!pointsToAdd) return msg.channel.send(noargsEmbed).then(m => m.delete({timeout:5000}));
		let userscore = client.getScore.get(user.id, msg.guild.id);
		if (!userscore) {
			userscore = { id: `${msg.guild.id}-${user.id}`, user: user.id, guild: msg.guild.id, points: 0, level: 0 }
		}
		let xpmsg;
		if(mode == "give") {
			userscore.points += pointsToAdd;
			xpmsg = "+";
			let userLevel = Math.floor(0.2 * Math.sqrt(userscore.points));
			userscore.level = userLevel;
			client.setScore.run(userscore);
		}		
		if(mode == "take") {
			if(userscore.points-pointsToAdd < 0) return msg.channel.send(nonegativeEmbed).then(m => m.delete({timeout:5000}));
			userscore.points -= pointsToAdd;
			xpmsg = "-";
			let userLevel = Math.floor(0.2 * Math.sqrt(userscore.points));
			userscore.level = userLevel;
			client.setScore.run(userscore);
		}
		if(mode == "set") {
			userscore.points = pointsToAdd;
			xpmsg = "Set to";
			let userLevel = Math.floor(0.2 * Math.sqrt(userscore.points));
			userscore.level = userLevel;
			client.setScore.run(userscore);
		}
		const xpcmdembed = new Discord.MessageEmbed()
			.setColor(`RANDOM`)
			.setAuthor(user.username, user.avatarURL())
			.setTitle(`${xpmsg} ${pointsToAdd} points`)
			.setDescription(`by ${msg.author.username}`)
		return msg.channel.send(xpcmdembed);

    }
}
