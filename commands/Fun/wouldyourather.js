const Discord = require("discord.js");

module.exports = {
    name: "wouldyourather",
    aliases: ["wur"],
    category: "Fun",
    description: "Would you rather... ?",
    run: async (client, msg, arg) => {
        if (!msg.guild.member(client.user).hasPermission('ADD_REACTIONS')) return msg.reply('Sorry, i dont have the perms to do this cmd i need ADD_REACTIONS. :x:')
        const superagent = require('superagent');
        const { body } = await superagent
            .get('http://www.rrrather.com/botapi');
        const embed = new Discord.RichEmbed()
            .setTitle(`${body.title}`)
            .setURL(body.link)
            .setColor(0x00A2E8)
            .setDescription(`${body.choicea} OR ${body.choiceb}?`);
        msg.channel.send(embed)
            .then(sentEmbed => {sentEmbed.react("🅰")
            .then (() => sentEmbed.react("🅱"))
            })
        }
}
