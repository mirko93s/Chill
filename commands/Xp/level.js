const Discord = require("discord.js");
const SQLite = require("better-sqlite3");
const sql = new SQLite('./xp_database/scores.sqlite');

module.exports = {
    name: "level",
    aliases: ["points"],
    category: "Xp",
    description: "Returns your XP points and level",
    usage: "level\n**e.g.**\n\`level\`\n> Get your XP points and Level",
    run: async (client, msg, arg) => {
        msg.delete();

        let score;
        score = client.getScore.get(msg.author.id, msg.guild.id);
            if (!score) {
                score = { id: `${msg.guild.id}-${msg.author.id}`, user: msg.author.id, guild: msg.guild.id, points: 0, level: 0 }
            }

		let fixedpoints = score.points;
		if(fixedpoints >= 1000 && fixedpoints <10000) fixedpoints = `${parseFloat(fixedpoints/1000).toFixed(1)} K`
			else if(fixedpoints >= 10000 && fixedpoints < 1000000) fixedpoints = `${Math.floor(fixedpoints/1000)} K`
				else if(fixedpoints >= 1000000 && fixedpoints < 10000000) fixedpoints = `${parseFloat(fixedpoints/1000000).toFixed(1)} M`
					else if(fixedpoints >= 10000000) fixedpoints = `${Math.floor(fixedpoints/1000000)} M`
		const levelembed = new Discord.MessageEmbed()
			.setColor(`RANDOM`)
			.setAuthor(msg.author.username, msg.author.avatarURL())
			.setTitle(`Lvl ${score.level}`)
			.setDescription(`${fixedpoints} points`)
		return msg.channel.send(levelembed);      
    }
}
