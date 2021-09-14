const Discord = require("discord.js");

module.exports = {
    name: "serveremojis",
    aliases: ["emojis", "emoji"],
    category: "Info",
    description: "Returns a list with all the emojis in this server",
    usage: "serveremojis\n**e.g.**\n\`serveremojis\`\n> Get a list with all the available emojis on this server",
    run: async (client, msg, arg) => {

        const noemojiEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Server has no emojis`)

        const emojis = await msg.guild.emojis.cache.map((e) => `${e}`).join('').toString();
        console.log(emojis);
        if (emojis.length < 1) return msg.channel.send({embeds:[noemojiEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
        const embed = new Discord.MessageEmbed()
            .setDescription(`Server Emojis:\n${emojis}`)
        msg.channel.send({embeds:{embed}});
    }
}
