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
            .setURL(`http://www.mirko93s.it/`)
            .setDescription(`Just another discord bot!`)

        msg.channel.send(embed)
    }
}
