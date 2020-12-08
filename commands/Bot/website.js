const Discord = require("discord.js");

module.exports = {
    name: "website",
    category: "Bot",
    description: "Bot's webiste link",
    usage: "website\n**e.g.**\n\`website\`\n> Return a link to the Bot's website",
    run: async (client, msg, arg) => {
        msg.delete();
        const embed = new Discord.MessageEmbed()
            .setColor(`RANDOM`)
            .setThumbnail(client.user.avatarURL)
            .setTitle(`**Chill - Discord Bot**`)
            .setURL(`https://www.mirko93s.it/`)
            .setDescription(`Just another discord bot!`)

        msg.channel.send(embed)
    }
}
