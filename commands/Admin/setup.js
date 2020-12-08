const Discord = require("discord.js");
const { stripIndent } = require('common-tags');

module.exports = {
    name: "setup",
    category: "Admin",
    description: "Setup the Bot so it can properly work on your server",
    usage: "setup\n**e.g.**\n> \`setup\`\n> It will create preset channels, roles, channel categories, etc...",
    permission: "ADMINISTRATOR",
    run: async (client, msg, arg) => {
        msg.delete();

        const nopermEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ You don't have permission to use this!`)

        if (!msg.member.hasPermission("ADMINISTRATOR")) return msg.reply(nopermEmbed).then(msg => msg.delete({ timeout: 5000 }));

        let welcomechannel = msg.guild.channels.cache.find(welcomechannel => welcomechannel.name === (client.settings.get(msg.guild.id, "welcomechannel")));
        let bcchannel = msg.guild.channels.cache.find(bcchannel => bcchannel.name === (client.settings.get(msg.guild.id, "bcchannel")));
        let puchannel = msg.guild.channels.cache.find(puchannel => puchannel.name === (client.settings.get(msg.guild.id, "puchannel")));
        let reportchannel = msg.guild.channels.cache.find(reportchannel => reportchannel.name === (client.settings.get(msg.guild.id, "reportchannel")));
        let gachannel = msg.guild.channels.cache.find(gachannel => gachannel.name === (client.settings.get(msg.guild.id, "gachannel")));
        let pollchannel = msg.guild.channels.cache.find(pollchannel => pollchannel.name === (client.settings.get(msg.guild.id, "pollchannel")));
        let musicvocalchannel = msg.guild.channels.cache.find(musicvocalchannel => musicvocalchannel.name === (client.settings.get(msg.guild.id, "musicvocalchannel")));
        let musictextchannel = msg.guild.channels.cache.find(musictextchannel => musictextchannel.name === (client.settings.get(msg.guild.id, "musictextchannel")));

        let ticketcategory = msg.guild.channels.cache.find(ticketcategory => ticketcategory.name === (client.settings.get(msg.guild.id, "ticketcategory")));

        let musictemprole = msg.guild.roles.cache.find(musictemprole => musictemprole.name === (client.settings.get(msg.guild.id, "musictemprole")));
        let mutedrole = msg.guild.roles.cache.find(mutedrole => mutedrole.name === (client.settings.get(msg.guild.id, "mutedrole")));
        let djrole = msg.guild.roles.cache.find(djrole => djrole.name === (client.settings.get(msg.guild.id, "djrole")));
        let supportrole = msg.guild.roles.cache.find(supportrole => supportrole.name === (client.settings.get(msg.guild.id, "supportrole")));
        let roleonjoin = msg.guild.roles.cache.find(roleonjoin => roleonjoin.name === (client.settings.get(msg.guild.id, "roleonjoin")));

        const created = "✅"
        const already = "❌"

        if(!ticketcategory) {
            msg.guild.channels.create(client.settings.get(msg.guild.id, "ticketcategory"), {type: 'category', 
            })
            ticketmsg = created
        } else ticketmsg = already
        if (!mutedrole) {
            msg.guild.roles.create({ data: {name: client.settings.get(msg.guild.id, "mutedrole"),permissions: [],color: '525252'}})
            mutedmsg = created
        } else mutedmsg = already
        if (!djrole) {
            msg.guild.roles.create({ data: {name: client.settings.get(msg.guild.id, "djrole"),permissions: ['CONNECT'], color: 'D00091'}})
            djmsg = created
        } else djmsg = already
        if (!musictemprole) {
            msg.guild.roles.create({ data: {name: client.settings.get(msg.guild.id, "musictemprole"),permissions: [], color: 'CCCC00'}})
            musictempmsg = created
        } else musictempmsg = already
        if (!supportrole) {
            msg.guild.roles.create({ data: {name: client.settings.get(msg.guild.id, "supportrole"),permissions: [], color: 'FC72F3'}})
            supportmsg = created
        } else supportmsg = already
        if (!roleonjoin) {
            msg.guild.roles.create({ data: {name: client.settings.get(msg.guild.id, "roleonjoin"),permissions: ['VIEW_CHANNEL'], color: '33FFFF'}})
            roleonmsg = created
        } else roleonmsg = already
        if(!welcomechannel) {
            msg.guild.channels.create(client.settings.get(msg.guild.id, "welcomechannel"), {type: 'text', 
                permissionOverwrites: [{id: msg.guild.roles.everyone.id, 
                deny: ['SEND_MESSAGES',`SEND_TTS_MESSAGES`,`EMBED_LINKS`,`ATTACH_FILES`
                ]}]})
            welcomemsg = created
        } else welcomemsg = already
        if(!bcchannel) {
            msg.guild.channels.create(client.settings.get(msg.guild.id, "bcchannel"), {type: 'text', 
                permissionOverwrites: [{id: msg.guild.roles.everyone.id, 
                deny: ['SEND_MESSAGES',`SEND_TTS_MESSAGES`,`EMBED_LINKS`,`ATTACH_FILES`
                ]}]})
            bcmsg = created
        } else bcmsg = already
        if(!puchannel) {
            msg.guild.channels.create(client.settings.get(msg.guild.id, "puchannel"), {type: 'text', 
            permissionOverwrites: [{id: msg.guild.roles.everyone.id, 
            deny: ['SEND_MESSAGES',`SEND_TTS_MESSAGES`,`EMBED_LINKS`,`ATTACH_FILES`
            ]}]})
            pumsg = created
        } else pumsg = already
        if(!reportchannel) {
            msg.guild.channels.create(client.settings.get(msg.guild.id, "reportchannel"), {type: 'text', 
            permissionOverwrites: [{id: msg.guild.roles.everyone.id, 
            deny: [`VIEW_CHANNEL`
            ]}]})
            reportmsg = created
        } else reportmsg = already
        if(!gachannel) {
            msg.guild.channels.create(client.settings.get(msg.guild.id, "gachannel"), {type: 'text', 
            permissionOverwrites: [{id: msg.guild.roles.everyone.id, 
            deny: ['SEND_MESSAGES',`SEND_TTS_MESSAGES`,`EMBED_LINKS`,`ATTACH_FILES`
            ]}]})
            gamsg = created
        } else gamsg = already
        if(!pollchannel) {
            msg.guild.channels.create(client.settings.get(msg.guild.id, "pollchannel"), {type: 'text', 
            permissionOverwrites: [{id: msg.guild.roles.everyone.id, 
            deny: ['SEND_MESSAGES',`SEND_TTS_MESSAGES`,`EMBED_LINKS`,`ATTACH_FILES`
            ]}]})
            pollmsg = created
        } else pollmsg = already
        if(!musicvocalchannel) {
            msg.guild.channels.create(client.settings.get(msg.guild.id, "musicvocalchannel"), {type: 'voice',
            permissionOverwrites: [
                {id: msg.guild.roles.everyone.id, 
                deny: ['SPEAK']}]
            })
            musicvocalmsg = created
        } else musicvocalmsg = already
        if(!musictextchannel) {
            msg.guild.channels.create(client.settings.get(msg.guild.id, "musictextchannel"), {type: 'text', 
            permissionOverwrites: [
                {id: msg.guild.roles.everyone.id, 
                deny: ['VIEW_CHANNEL']},
                {id: musictemprole.id,
                allow: ['VIEW_CHANNEL','SEND_MESSAGES']}]
            })
            musictextmsg = created
        } else musictextmsg = already

        const channels = stripIndent`
        ${welcomemsg} | ${client.settings.get(msg.guild.id, "welcomechannel")}
        ${bcmsg} | ${client.settings.get(msg.guild.id, "bcchannel")}
        ${pumsg} | ${client.settings.get(msg.guild.id, "puchannel")}
        ${reportmsg} | ${client.settings.get(msg.guild.id, "reportchannel")}
        ${gamsg} | ${client.settings.get(msg.guild.id, "gachannel")}
        ${pollmsg} | ${client.settings.get(msg.guild.id, "pollchannel")}
        ${musicvocalmsg} | ${client.settings.get(msg.guild.id, "musicvocalchannel")}
        ${musictextmsg} | ${client.settings.get(msg.guild.id, "musictextchannel")}
        `;
        
        const roles = stripIndent`
        ${mutedmsg} | ${client.settings.get(msg.guild.id, "mutedrole")}
        ${djmsg} | ${client.settings.get(msg.guild.id, "djrole")}
        ${musictempmsg} | ${client.settings.get(msg.guild.id, "musictemprole")}
        ${supportmsg} | ${client.settings.get(msg.guild.id, "supportrole")}
        ${roleonmsg} | ${client.settings.get(msg.guild.id, "roleonjoin")}
        `;
        
        const categories = stripIndent`
		${ticketmsg} | ${client.settings.get(msg.guild.id, "ticketcategory")}
		`;

        let setupembed = new Discord.MessageEmbed()
            .setTitle("**SETUP**")
            .setColor(`RANDOM`)
            .setThumbnail(client.user.displayAvatarURL())
            .setDescription(`**Prefix** | \`${client.settings.get(msg.guild.id, "prefix")}\``)
            .addField(`**Channels**`, `\`\`\`${channels}\`\`\``, false)
            .addField(`**Roles**`, `\`\`\`${roles}\`\`\``, false)
            .addField(`**Categories**`, `\`\`\`${categories}\`\`\``, false)
            .setFooter(`${created} Created\n${already} Already exists`)
        msg.channel.send(setupembed);
    }
}
