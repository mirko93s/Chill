const Discord = require("discord.js");

module.exports = {
    name: "setup",
    category: "Admin",
    description: "Initial setup",
    permission: "ADMINISTRATOR",
    run: async (client, msg, arg) => {
        msg.delete();

        const nopermEmbed = new Discord.RichEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ You don't have permission to use this!`)

        if (!msg.member.hasPermission("ADMINISTRATOR")) return msg.reply(nopermEmbed).then(msg => msg.delete(5000));
        let bcchannel = msg.guild.channels.find(bcchannel => bcchannel.name === '🔴broadcast');
        let puchannel = msg.guild.channels.find(puchannel => puchannel.name === '🔨punishments');
        let reportchannel = msg.guild.channels.find(reportchannel => reportchannel.name === '🚨reports');
        let gachannel = msg.guild.channels.find(gachannel => gachannel.name === '🎉giveaway');
        let pollchannel = msg.guild.channels.find(pollchannel => pollchannel.name === `💡poll`);
        let mutedrole = msg.guild.roles.find(mutedrole => mutedrole.name === "Muted");
        let djrole = msg.guild.roles.find(djrole => djrole.name === "DJ");
        const created = "✅"
        const already = "❌"
        if(!bcchannel) {
            msg.guild.createChannel('🔴broadcast', {type: 'text', 
                permissionOverwrites: [{id: msg.guild.defaultRole.id, 
                deny: ['SEND_MESSAGES',`SEND_TTS_MESSAGES`,`EMBED_LINKS`,`ATTACH_FILES`
                ]}]})
            bcmsg = created
        } else bcmsg = already
        if(!puchannel) {
            msg.guild.createChannel("🔨punishments", {type: 'text', 
            permissionOverwrites: [{id: msg.guild.defaultRole.id, 
            deny: ['SEND_MESSAGES',`SEND_TTS_MESSAGES`,`EMBED_LINKS`,`ATTACH_FILES`
            ]}]})
            pumsg = created
        } else pumsg = already
        if(!reportchannel) {
            msg.guild.createChannel("🚨reports", {type: 'text', 
            permissionOverwrites: [{id: msg.guild.defaultRole.id, 
            deny: [`VIEW_CHANNEL`
            ]}]})
            reportmsg = created
        } else reportmsg = already
        if(!gachannel) {
            msg.guild.createChannel("🎉giveaway", {type: 'text', 
            permissionOverwrites: [{id: msg.guild.defaultRole.id, 
            deny: ['SEND_MESSAGES',`SEND_TTS_MESSAGES`,`EMBED_LINKS`,`ATTACH_FILES`
            ]}]})
            gamsg = created
        } else gamsg = already
        if(!pollchannel) {
            msg.guild.createChannel("💡poll", {type: 'text', 
            permissionOverwrites: [{id: msg.guild.defaultRole.id, 
            deny: ['SEND_MESSAGES',`SEND_TTS_MESSAGES`,`EMBED_LINKS`,`ATTACH_FILES`
            ]}]})
            pollmsg = created
        } else pollmsg = already
        if (!mutedrole) {
            msg.guild.createRole({name: 'Muted',color: '525252'})
            mutedmsg = created
        } else mutedmsg = already
        if (!djrole) {
            msg.guild.createRole({name: 'DJ',permissions: ['CONNECT'], color: 'D00091'})
            djmsg = created
        } else djmsg = already
        let setupembed = new Discord.RichEmbed()
            .setTitle("**SETUP**")
            .setColor(`RANDOM`)
            .setThumbnail(client.user.displayAvatarURL)
            .setDescription(`
                    **Channels**
                    \n${bcmsg} | 🔴broadcast
                    \n${pumsg} | 🔨punishments
                    \n${reportmsg} | 🚨reports
                    \n${gamsg} | 🎉giveaway
                    \n${pollmsg} | 💡poll
                    \n**Roles**
                    \n${mutedmsg} | Muted
                    \n${djmsg} | DJ
                    \n*${created} Created ${already} Already exists*
                `)
        msg.channel.send(setupembed);
    }
}
