const Discord = require("discord.js");
const snekfetch = require('snekfetch');
const types = ['top'];

module.exports = {
    name: "urban",
    category: "Fun",
    description: "Returns explanation of an urban word",
    usage: "<word>",
    run: async (client, msg, arg) => {
        msg.delete();
        const word = arg.join(" ")
        try {
        const { body } = await snekfetch
            .get('http://api.urbandictionary.com/v0/define')
            .query({ term: word });
        if (!body.list.length) return msg.channel.send('Could not find any results.');
        const data = body.list[types === 'top' ? 0 : Math.floor(Math.random() * body.list.length)];
        const embed = new Discord.RichEmbed()
            .setColor(0x32A8F0)
            .setAuthor('Urban Dictionary', 'https://i.imgur.com/Fo0nRTe.png', 'https://www.urbandictionary.com/')
            .setURL(data.permalink)
            .setTitle(data.word)
            .setDescription((data.definition))
            .addField('Example', data.example);
        const filtercheck = ["xxx", "porn", "sex", "18+","nsfw", "hentai", "dick", "vagina", "pussy"]
        if (filtercheck.some(word2 => data.definition.toLowerCase().includes(word2))) return msg.channel.send("Not allowed to search nsfw content.");
        if (filtercheck.some(word3 => data.word.toLowerCase().includes(word3))) return msg.channel.send("Not allowed to search nsfw content.");
        msg.channel.send(embed);
        } catch (err) {
        return msg.channel.send(`Oh no, an error occurred: \`${err.msg}\`. Try again later!`);
        }
    }
}
