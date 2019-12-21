const Discord = require("discord.js");

module.exports = {
    name: "website",
    category: "Bot",
    description: "Website link",
    run: async (client, msg, arg) => {
        msg.delete();
        const embed = new Discord.RichEmbed()
            .setColor(`RANDOM`)
            .setThumbnail(client.user.avatarURL)
            .setTitle(`**Chill - Discord Bot**`)
            .setURL(`paste-website-link-here`)
            .setDescription(`Just another discord bot!`)

        msg.channel.send(embed)
    }
}
