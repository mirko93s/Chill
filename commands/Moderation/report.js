const Discord = require("discord.js");
const { stripIndents } = require("common-tags");

module.exports = {
    name: "report",
    category: "moderation",
    description: "Report a member for breaking the rules",
    usage: "report <mention | id> <reason>\n**e.g.**\n\`report @mirko93s spamming in chat channel\`\n> You will report mirko93s for spammin in a channel\n> Your report will be sent to the report channel\n> Moderators can then take a decision about the reported member",
    run: async (client, message, args) => {
        message.delete();

        const noargsEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Please mention a valid user of this server and provide a reason`)
        const nochannelEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Reports channel not found`)
        const nobotEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ You can't report me`)
        const thanksEmbed = new Discord.MessageEmbed()
            .setColor(`GREEN`)
            .setTitle(`✅ Thanks for reporting this person.\nA staff member will take a decision as soon as possible`)

        let rMember = message.mentions.members.first();

        if (!rMember || !args[1]) return message.channel.send(noargsEmbed).then(msg => msg.delete({ timeout: 5000 }));
        if (rMember.user.bot) return message.channel.send(nobotEmbed).then(msg => msg.delete({ timeout: 5000 }));
        
        let reportchannel = message.guild.channels.cache.find(reportchannel => reportchannel.name === (client.settings.get(message.guild.id, "reportchannel")));
        
        if(!reportchannel) return message.channel.send(nochannelEmbed).then(msg => msg.delete({ timeout: 5000 }));

        message.channel.send(thanksEmbed).then(msg => msg.delete({ timeout: 5000 }));

        const embed = new Discord.MessageEmbed()
            .setColor("#ff0000")
            .setTimestamp()
            .setFooter(message.guild.name, message.guild.iconURL)
            .setAuthor("Reported member", rMember.user.displayAvatarURL())
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