const Discord = require("discord.js");
const { fancyNumber } = require("../../functions.js");

module.exports = {
    name: "leaderboard",
    aliases: ["lb"],
    category: "Xp",
    description: "Returns top 10 leaderboard",
    usage: "leaderboard\n**e.g.**\n\`leaderboard\`\n> Check the Top 10 users with the most xp(messages sent) in this server\n> Commands don't give xp",
    run: async (client, msg, arg) => {

		const filtered = client.xp.filter( p => p.guild === msg.guild.id ).array();
		const sorted = filtered.sort((a, b) => b.points - a.points);
		const top10 = sorted.splice(0, 10);
		let emojiposition = 0;
		const embed = new Discord.MessageEmbed()
			.setTitle("🏆 Leaderboard 🏆")
			.setAuthor(msg.guild.name, msg.guild.iconURL)
			.setDescription("Top 10")
			.setColor(0x00AE86);
		var emoji = ["🥇","🥈","🥉","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣","🔟"];
		for(const data of top10) {
			data.points = fancyNumber(data.points);
			embed.addField(`${emoji[emojiposition]}**${client.users.cache.get(data.user).username}**`, `> Lvl ${data.level} | ${data.points}`, true);
			emojiposition++;
		}
		return msg.channel.send(embed);
    }
}
