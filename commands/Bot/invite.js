const Discord = require("discord.js");

module.exports = {
    name: "invite",
    category: "Bot",
    description: "Bot's invite link",
    run: async (client, msg, arg) => {
        msg.delete();
        const embed = new Discord.RichEmbed()
            .setColor(`RANDOM`)
            .setThumbnail(client.user.avatarURL)
            .setTitle(`**Chill** BOT`)
            .setDescription(`[**Invite**](paste-bot-invite-here)`);
        msg.channel.send(embed)
    }
}
