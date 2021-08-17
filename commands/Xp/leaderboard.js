const Discord = require("discord.js");
const { fancyNumber } = require("../../functions.js");

module.exports = {
    name: "leaderboard",
    aliases: ["lb"],
    category: "Xp",
    description: "Returns top 10 leaderboard",
    usage: "leaderboard\n**e.g.**\n\`leaderboard\`\n> Check the Top 10 users with the most xp(messages sent) in this server\n> Commands don't give xp",
    run: async (client, msg, arg) => {
		client.settings.ensure(msg.guild.id, {xp: {}});
		const moduleDisabledEmbed = new Discord.MessageEmbed()
			.setColor(`RED`)
			.setTitle(`⛔ This module is disabled on this server!`)
		if (client.settings.get(msg.guild.id, "xpmodule") === "false") return msg.channel.send({embeds:[moduleDisabledEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
		var users = client.settings.get(msg.guild.id,"xp"); //get object
		var sorted = {};  
            Object //sort object
                .keys(users).sort(function(a, b){
                    return users[b].points - users[a].points;
                })
                .forEach(function(key) {
                    sorted[key] = users[key];
                });
		var top10 = Object.keys(sorted).map((key) => [key, sorted[key]]).splice(0,10); //map and splice object
		let emojiposition = 0;
		const embed = new Discord.MessageEmbed()
			.setAuthor(`${msg.guild.name} 🏆 Leaderboard 🏆`, msg.guild.iconURL())
			.setColor(0x00AE86);
		var emoji = ["🥇","🥈","🥉","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣","🔟"];
		var pos4to10 = "";
		for(const [user,data] of top10) {
			data.points = fancyNumber(data.points);
			if (emojiposition === 0) embed.setTitle(`${emoji[emojiposition]}**${client.users.cache.get(user).username}**\n> **Lvl ${data.level}** - ${data.points} xp`, true);
			else if (emojiposition === 1 || emojiposition === 2) embed.addField(`${emoji[emojiposition]}**${client.users.cache.get(user).username}**`, `> **Lvl ${data.level}** - ${data.points} xp`, true);
			else if (emojiposition === 3) pos4to10 = `${emoji[emojiposition]}${client.users.cache.get(user).username}\n\tLvl ${data.level} - ${data.points} xp`;
			else pos4to10 += `\n${emoji[emojiposition]}${client.users.cache.get(user).username}\n\tLvl ${data.level} - ${data.points} xp`;
			emojiposition++;
		}
		if (pos4to10.length > 1) embed.setFooter(pos4to10);
		return msg.channel.send({embeds:[embed]});
    }
}
