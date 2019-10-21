const Discord = require("discord.js");

module.exports = {
    name: "serveremojis",
    aliases: ["emojis", "emoji"],
    category: "Info",
    description: "Returns a list with server's emojis",
    run: async (client, msg, arg) => {
        msg.delete();
        const noemojiEmbed = new Discord.RichEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Server has no emojis`)
        const emoji = msg.guild.emojis;
        if (!emoji.size) return msg.channel.send(noemoji).then(msg => msg.delete(5000));
        const embed = new Discord.RichEmbed()
            .addField("Server Emojis", emoji.map((e) => e).join(' '))
        msg.channel.send({embed})
    }
}
