const Discord = require("discord.js");
const config = require('../../config.json');

module.exports = {
    name: "website",
    category: "Bot",
    description: "Bot's webiste link",
    usage: "website\n**e.g.**\n\`website\`\n> Return a link to the Bot's website",
    run: async (client, msg, arg) => {
        
        const embed = new Discord.MessageEmbed()
            .setColor(`RANDOM`)
            .setThumbnail(client.user.avatarURL)
            .setTitle(`**Chill - Discord Bot**`)
            .setURL(config.bot_website_link)
            .setDescription(`Just another discord bot!`)

        msg.channel.send(embed);
    }
}
