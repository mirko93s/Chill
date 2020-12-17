const Discord = require("discord.js");
const config = require('../../config.json');

module.exports = {
    name: "invite",
    category: "Bot",
    description: "Bot's invite link",
    usage: "invite\n**e.g.**\n\`invite\`\n> Returns a link to Invite the bot on another server",
    run: async (client, msg, arg) => {
        if (client.settings.get(msg.guild.id, "autodeletecmds") === "true") msg.delete();

        const inviteEmbed = new Discord.MessageEmbed()
            .setColor(`RANDOM`)
            .setThumbnail(client.user.avatarURL)
            .setTitle(`**Chill** BOT`)
            .setDescription(`[**Invite**](${config.bot_invite_link})`);

        msg.channel.send(inviteEmbed)
    }
}
