const Discord = require("discord.js");
const fetch = require('node-fetch');
const querystring = require('querystring');
const types = ['top'];

module.exports = {
    name: "urban",
    category: "Fun",
    description: "Learn the meaning of urban words",
    usage: "urban <word | sentence>\n**e.g.**\n\`urban LOL\`\n> will explain you what \"LOL\" means",
    run: async (client, msg, arg) => {
        if (client.settings.get(msg.guild.id, "autodeletecmds") === "true") msg.delete();

        const noresultEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Couldn't find any result`)
        const nonsfwEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ nsfw content is not allowed`)

        try {
            const query = querystring.stringify({ term: arg.join(' ') });
            const body = await fetch(`https://api.urbandictionary.com/v0/define?${query}`).then(response => response.json());
            if (!body.list.length) return msg.channel.send(noresultEmbed).then(msg => msg.delete({ timeout: 5000 }));
            const data = body.list[types === 'top' ? 0 : Math.floor(Math.random() * body.list.length)];
            const embed = new Discord.MessageEmbed()
                .setColor(0x32A8F0)
                .setAuthor('Urban Dictionary', 'https://i.imgur.com/Fo0nRTe.png', 'https://www.urbandictionary.com/')
                .setURL(data.permalink)
                .setTitle(data.word)
                .setDescription((data.definition))
                .addField('Example', data.example);
            const filtercheck = ["xxx", "porn", "sex", "18+","nsfw", "hentai", "dick", "vagina", "pussy"]
            if (filtercheck.some(word2 => data.definition.toLowerCase().includes(word2))) return msg.channel.send(nonsfwEmbed).then(msg => msg.delete({ timeout: 5000 }));
            if (filtercheck.some(word3 => data.word.toLowerCase().includes(word3))) return msg.channel.send(nonsfwEmbed).then(msg => msg.delete({ timeout: 5000 }));
            msg.channel.send(embed);
        } catch (err) {
            const errorEmbed = new Discord.MessageEmbed()
                .setColor(`RED`)
                .setTitle(`⛔ ${err.msg}`)
            return msg.channel.send(errorEmbed).then(msg => msg.delete({ timeout: 5000 }));
        }
    }
}
