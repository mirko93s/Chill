const Discord = require("discord.js");
const { stripIndents } = require("common-tags");

module.exports = {
    name: "userinfo",
    description: "Shows some user statistics (also available right-clicking someone)",
    options: [
        {
            name: 'user',
            description: 'User to get info about',
            type: 'USER',
        },
    ],
    run: async (client, interaction, arg) => {
        getProfile(interaction, interaction.options.getMember('user') || interaction.member);        
    }
}

module.exports.user = {
    name: "Profile",
    type: 'USER',
    contextdescription: 'Shows some user statistics',
    run: async (client, interaction, arg) => {
        getProfile(interaction, interaction.targetMember);        
    }
}

async function getProfile(interaction, member) {
    const embed = new Discord.MessageEmbed()
        .setAuthor({name:member.user.tag, iconURL:member.displayAvatarURL()})
        .setThumbnail(member.user.displayAvatarURL())
        .setColor(member.displayHexColor)
        .addField('Guild information:',stripIndents`
        **> Display name:** ${member.displayName}
        **> Joined at:** <t:${(member.joinedTimestamp/1e3).toFixed(0)}>
        **> Boosting since:** ${member.premiumSinceTimestamp?`<t:${(member.premiumSinceTimestamp/1e3).toFixed(0)}>`:'No'}
        **> Roles:** ${member.roles.cache.filter(r => r.id !== interaction.guild.id).map(r => r).join(", ") || 'None'}`, true)
        .addField('Personal information:', stripIndents`
        **> ID:** ${member.user.id}
        **> Username:** ${member.user.username}
        **> Tag:** ${member.user.tag}
        **> Created at:** <t:${(member.user.createdTimestamp/1e3).toFixed(0)}>`, true)      
    
    if (member.presence?.activities) {
        const activitytype = {PLAYING: 'Playing', STREAMING: 'Streaming', LISTENING: 'Listening', WATCHING: 'Watching', CUSTOM: 'Custom', COMPETING: 'Competing'}
        let activitystring = "";
        member.presence.activities.forEach(activity => {
            activitystring +=`\n> **${activitytype[activity.type]}**${activity.name == "Custom Status" ? `\n${activity.state}` : `\n${activity.name} - *${activity.details}*`}` 
        })
        embed.addField('Activites', activitystring);
    }
    interaction.reply({embeds:[embed]});
}