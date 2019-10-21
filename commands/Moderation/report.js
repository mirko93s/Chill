const Discord = require("discord.js");
const { stripIndents } = require("common-tags");

module.exports = {
    name: "report",
    category: "moderation",
    description: "Reports a member",
    usage: "<mention, id>",
    run: async (client, message, args) => {
        message.delete();

        const noargsEmbed = new Discord.RichEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Please mention a valid user of this server and provide a reason`)
        const nochannelEmbed = new Discord.RichEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Reports channel not found`)
        const nobotEmbed = new Discord.RichEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ You can't report me`)
        const thanksEmbed = new Discord.RichEmbed()
            .setColor(`GREEN`)
            .setTitle(`✅ Thanks for reporting this person.\nA staff member will take a decision as soon as possible`)

        let rMember = message.mentions.members.first();

        if (!rMember || args[1]) return message.channel.send(noargsEmbed).then(m => m.delete(5000));
        if (rMember.user.bot) return message.channel.send(nobotEmbed).then(m => m.delete(5000));
        
        let reportchannel = message.guild.channels.find(reportchannel => reportchannel.name === "🚨reports");
        
        if(!reportchannel) return message.channel.send(nochannelEmbed).then(m => m.delete(5000));

        message.channel.send(thanksEmbed).then(m => m.delete(5000));

        const embed = new Discord.RichEmbed()
            .setColor("#ff0000")
            .setTimestamp()
            .setFooter(message.guild.name, message.guild.iconURL)
            .setAuthor("Reported member", rMember.user.displayAvatarURL)
            .setDescription(stripIndents`**> Member:** ${rMember} (${rMember.user.id})
            **> Reported by:** ${message.member}
            **> Reported in:** ${message.channel}
            **> Reason:** ${args.slice(1).join(" ")}`);

        reportchannel.send(embed).then(sentEmbed => {
            sentEmbed.react("✅")
            .then (() => sentEmbed.react("❔"))
            .then (() => sentEmbed.react("❌"))
            })
    }
}