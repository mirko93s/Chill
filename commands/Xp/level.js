const Discord = require("discord.js");
const { fancyNumber } = require("../../functions.js");

module.exports = {
    name: "level",
    aliases: ["points"],
    category: "Xp",
    description: "Returns your XP points and level",
    usage: "level\n**e.g.**\n\`level\`\n> Get your XP points and Level",
    run: async (client, msg, arg) => {
		if (client.settings.get(msg.guild.id, "autodeletecmds") === "true") msg.delete();
		
		client.xp.ensure(`${msg.guild.id}-${msg.author.id}`, {
			user: msg.author.id,
			guild: msg.guild.id,
			points: 0,
			level: 0
		});
        const key = `${msg.guild.id}-${msg.author.id}`;
		let points = client.xp.get(key, "points");
		points = fancyNumber(points);
		const levelembed = new Discord.MessageEmbed()
			.setColor(`RANDOM`)
			.setAuthor(msg.author.username, msg.author.avatarURL())
			.setTitle(`Lvl ${client.xp.get(key, "level")}`)
			.setDescription(`${points} points`)
		return msg.channel.send(levelembed);      
    }
}
