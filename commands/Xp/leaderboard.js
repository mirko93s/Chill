const Discord = require("discord.js");
const SQLite = require("better-sqlite3");
const sql = new SQLite('./xp_database/scores.sqlite');

module.exports = {
    name: "leaderboard",
    aliases: ["lb"],
    category: "Xp",
    description: "Returns top 10 leaderboard",
    usage: "leaderboard\n**e.g.**\n\`leaderboard\`\n> Check the Top 10 users with the most xp(messages sent) in this server\n> Commands don't give xp",
    run: async (client, msg, arg) => {
		if (client.settings.get(msg.guild.id, "autodeletecmds") === "true") msg.delete();
		
		const top10 = sql.prepare("SELECT * FROM scores WHERE guild = ? ORDER BY points DESC LIMIT 10;").all(msg.guild.id);
		let emojiposition = 0;
		const embed = new Discord.MessageEmbed()
			.setTitle("🏆 Leaderboard 🏆")
			.setAuthor(msg.guild.name, msg.guild.iconURL)
			.setDescription("Top 10")
			.setColor(0x00AE86);
		var emoji = ["🥇","🥈","🥉","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣","🔟"];
		for(const data of top10) {
			if(data.points >= 1000 && data.points <10000) data.points = `${parseFloat(data.points/1000).toFixed(1)} K`
				else if(data.points >= 10000 && data.points < 1000000) data.points = `${Math.floor(data.points/1000)} K`
					else if(data.points >= 1000000 && data.points < 10000000) data.points = `${parseFloat(data.points/1000000).toFixed(1)} M`
						else if(data.points >= 10000000) data.points = `${Math.floor(data.points/1000000)} M`
			embed.addField(`${emoji[emojiposition]}**${client.users.cache.get(data.user).username}**`, `> ${data.points} | Lvl ${data.level}`, true);
			emojiposition++;
		}
		return msg.channel.send(embed);
    }
}
