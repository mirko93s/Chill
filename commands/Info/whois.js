const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { formatDate } = require("../../functions.js");

module.exports = {
    name: "whois",
    aliases: ["who", "user"],
    category: "Info",
    description: "Returns user info",
    usage: "whois [name | id | mention]\n**e.g.**\n\`whois mirko\`\n> will return the closest username found on the server\n\`whois @mirko93s\`\n> will return the mentioned user\n> whois shows some info about that user",
    run: async (client, msg, arg) => {

        let member = msg.mentions.members.first();
        if (!msg.mentions.members.size) member = msg.member;

        const embed = new MessageEmbed()
            .setFooter(member.displayName, member.user.displayAvatarURL())
            .setThumbnail(member.user.displayAvatarURL())
            .setColor(member.displayHexColor === '#000000' ? '#ffffff' : member.displayHexColor)

            .addField('Guild information:',stripIndents`
            **> Display name:** ${member.displayName}
            **> Joined at:** ${formatDate(member.joinedAt)}
            **> Roles:** ${member.roles.cache.filter(r => r.id !== msg.guild.id).map(r => r).join(", ") || 'none'}`, true)

            .addField('Personal information:', stripIndents`
            **> ID:** ${member.user.id}
            **> Username:** ${member.user.username}
            **> Tag:** ${member.user.tag}
            **> Created at:** ${formatDate(member.user.createdAt)}`, true)
            
            .setTimestamp()

        if (member.presence.activities) {
            const activitytype = {PLAYING: 'Playing', STREAMING: 'Streaming', LISTENING: 'Listening', WATCHING: 'Watching', CUSTOM: 'Custom', COMPETING: 'Competing'}
            let activitystring = "";
            member.presence.activities.forEach(activity => {
                activitystring +=`\n> **${activitytype[activity.type]}**${activity.name == "Custom Status" ? `\n${activity.state}` : `\n${activity.name} - *${activity.details}*`}` 
            })
            embed.addField('Activites', activitystring);
        }
        msg.channel.send({embeds:[embed]});
    }
}