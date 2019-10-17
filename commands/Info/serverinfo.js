const Discord = require("discord.js");

module.exports = {
    name: "serverinfo",
    aliases: ["server"],
    category: "Other",
    description: "Returns server info",
    run: async (client, msg, arg) => {
        const role = msg.guild.roles.size;
        const online = msg.guild.members.filter(m => m.presence.status != 'offline').size
        const verificationLevels = ['None', 'Low', 'Medium', 'Insane', 'Extreme'];
            const embed = new Discord.RichEmbed()
            .setAuthor(msg.guild.name, msg.guild.iconURL)
            .setColor(0x00A2E8)
            .setThumbnail(msg.guild.iconURL)
            .setDescription(`Owner: ${msg.guild.owner.user.tag} (${msg.guild.owner.id})`)
            .addField('Member Count', `${msg.guild.memberCount}`, true)
            .addField('Online', `${online}`, true)
            .addField('Server Region', msg.guild.region)
            .addField('Created At', msg.guild.createdAt.toLocaleString(), true)
            .addField(msg.author.username + " Joined At", msg.member.joinedAt.toLocaleString(), true)
            .addField("Verification Level: ", `${verificationLevels[msg.guild.verificationLevel]}`)
            .addField('Voice Channels' , `${msg.guild.channels.filter(chan => chan.type === 'voice').size}`)
            .addField('Text Channels' , `${msg.guild.channels.filter(chan => chan.type === 'text').size}`, true)
            .addField('Roles', role, true)
            msg.channel.send({embed}) 
    }
}
