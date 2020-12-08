const Discord = require("discord.js");

module.exports = {
    name: "poll",
    category: "Admin",
    description: "Start a poll in the preset channel",
    usage: "poll <question>\n**e.g.**\n\`poll is this a question?\`\n> It will create a poll in the \"poll-channel\" with the question \"is this a question ?\"\n> Then people can choose between 3 reactions",
    permission: "MANAGE_GUILD",
    run: async (client, msg, arg) => {
        msg.delete();

        const nopermEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ You don't have permission to use this!`)
        const nochannelEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Poll channel not found`)
        const noquestionEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Please provide a question to start a poll`)
            .setFooter(`Question must be longer than 10 characters`)

        if(!msg.guild.member(msg.author).hasPermission('MANAGE_GUILD')) return msg.channel.send(nopermEmbed).then(msg => msg.delete({ timeout: 5000 }));
        let pollchannel = msg.guild.channels.cache.find(pollchannel => pollchannel.name === (client.settings.get(msg.guild.id, "pollchannel")));
        if(!pollchannel) return msg.channel.send(nochannelEmbed).then(msg => msg.delete({ timeout: 5000 }));
        let question = arg.join(' ');
        if(!question || question < 10) return msg.channel.send(noquestionEmbed).then(msg => msg.delete({ timeout: 5000 }));
        let pollEmbed = new Discord.MessageEmbed()
            .setColor(`RANDOM`)
            .setTitle(`**${question}**`)
            .setDescription(`*React to vote*`)
            .setTimestamp()
        pollchannel.send(pollEmbed).then(sentEmbed => {
            sentEmbed.react("👍")
            .then (() => sentEmbed.react("❔"))
            .then (() => sentEmbed.react("👎"))
        })
    }
}