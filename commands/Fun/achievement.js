const Discord = require("discord.js");
const superagent = require("superagent");

module.exports = {
    name: "achievement",
    aliases: ["ach"],
    category: "Fun",
    description: "Generate a Minecraft achievement",
    usage: "achievement <text>\n**e.g.**\n\`achievement Use your first command\`\n> This will generate an achievement image using Minecraft style",
    run: async (client, msg, arg) => {

        const textErrEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Provide a text (max 25 characters)`)

        try {
            const text = arg.join(" ");
            if (!text || text.length > 25) return msg.channel.send({embeds:[textErrEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
			const { body } = await superagent
				.get('https://www.minecraftskinstealer.com/achievement/a.php')
				.query({
                    i: 1,
                    h: 'Achievement Unlocked!',
                    t: text
                });
            msg.channel.send({ files: [{ attachment: body, name: 'achievement.png' }]});
        } catch (err) {
            console.log(err);
		}
    }
}
