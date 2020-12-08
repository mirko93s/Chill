const Discord = require("discord.js");

module.exports = {
    name: "serveremojis",
    aliases: ["emojis", "emoji"],
    category: "Info",
    description: "Returns a list with all the emojis in this server",
    usage: "serveremojis\n**e.g.**\n\`serveremojis\`\n> Get a list with all the available emojis on this server",
    run: async (client, msg, arg) => {
        msg.delete();
        const noemojiEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Server has no emojis`)
        const emoji = msg.guild.emojis;
        if (!emoji.size) return msg.channel.send(noemojiEmbed).then(msg => msg.delete({ timeout: 5000 }));
        const embed = new Discord.MessageEmbed()
            .addField("Server Emojis", emoji.map((e) => e).join(' '))
        msg.channel.send({embed})
    }
}
