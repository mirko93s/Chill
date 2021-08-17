const Discord = require("discord.js");
const { stripIndent } = require('common-tags');

module.exports = {
    name: "setup",
    category: "Admin",
    description: "Setup the Bot so it can properly work on your server",
    usage: "setup\n**e.g.**\n> \`setup\`\n> It will create preset channels, roles, channel categories, etc...",
    permission: "ADMINISTRATOR",
    run: async (client, msg, arg) => {

        const nopermEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ You don't have permission to use this!`)

        if (!msg.member.permissions.has("ADMINISTRATOR")) return msg.channel.send({embeds:[nopermEmbed]}).then(msg => msg.delete({ timeout: 5000 }));

        let welcomechannel = msg.guild.channels.cache.find(welcomechannel => welcomechannel.id === (client.settings.get(msg.guild.id, "welcomechannel")));
        let bcchannel = msg.guild.channels.cache.find(bcchannel => bcchannel.id === (client.settings.get(msg.guild.id, "bcchannel")));
        let puchannel = msg.guild.channels.cache.find(puchannel => puchannel.id === (client.settings.get(msg.guild.id, "puchannel")));
        let reportchannel = msg.guild.channels.cache.find(reportchannel => reportchannel.id === (client.settings.get(msg.guild.id, "reportchannel")));
        let gachannel = msg.guild.channels.cache.find(gachannel => gachannel.id === (client.settings.get(msg.guild.id, "gachannel")));
        let pollchannel = msg.guild.channels.cache.find(pollchannel => pollchannel.id === (client.settings.get(msg.guild.id, "pollchannel")));
        let musicvocalchannel = msg.guild.channels.cache.find(musicvocalchannel => musicvocalchannel.id === (client.settings.get(msg.guild.id, "musicvocalchannel")));
        let musictextchannel = msg.guild.channels.cache.find(musictextchannel => musictextchannel.id === (client.settings.get(msg.guild.id, "musictextchannel")));

        let ticketcategory = msg.guild.channels.cache.find(ticketcategory => ticketcategory.id === (client.settings.get(msg.guild.id, "ticketcategory")));

        let musictemprole = msg.guild.roles.cache.find(musictemprole => musictemprole.id === (client.settings.get(msg.guild.id, "musictemprole")));
        let mutedrole = msg.guild.roles.cache.find(mutedrole => mutedrole.id === (client.settings.get(msg.guild.id, "mutedrole")));
        let djrole = msg.guild.roles.cache.find(djrole => djrole.id === (client.settings.get(msg.guild.id, "djrole")));
        let supportrole = msg.guild.roles.cache.find(supportrole => supportrole.id === (client.settings.get(msg.guild.id, "supportrole")));
        let roleonjoin = msg.guild.roles.cache.find(roleonjoin => roleonjoin.id === (client.settings.get(msg.guild.id, "roleonjoin")));

        const created = "✅"
        const already = "❌"
        //cateogories
        if(!ticketcategory) {
            msg.guild.channels.create("🎫tickets", {type: 'GUILD_CATEGORY'})
            .then(channel => {client.settings.set(msg.guild.id, channel.id, "ticketcategory")});
            ticketmsg = created
        } else ticketmsg = already
        //roles
        if (!mutedrole) {
            msg.guild.roles.create({ name: "Muted",permissions: [],color: '525252'})
            .then(role => {client.settings.set(msg.guild.id, role.id, "mutedrole")});
            mutedmsg = created
        } else mutedmsg = already
        if (!djrole) {
            msg.guild.roles.create({ name: "DJ",permissions: ['CONNECT'], color: 'D00091'})
            .then(role => {client.settings.set(msg.guild.id, role.id, "djrole")});
            djmsg = created
        } else djmsg = already
        if (!musictemprole) {
            msg.guild.roles.create({ name: "Listening",permissions: [], color: 'CCCC00'})
            .then(role => {client.settings.set(msg.guild.id, role.id, "musictemprole")});
            musictempmsg = created
        } else musictempmsg = already
        if (!supportrole) {
            msg.guild.roles.create({ name: "Support",permissions: [], color: 'FC72F3'})
            .then(role => {client.settings.set(msg.guild.id, role.id, "supportrole")});
            supportmsg = created
        } else supportmsg = already
        if (!roleonjoin) {
            msg.guild.roles.create({ name: "Member",permissions: ['VIEW_CHANNEL'], color: '33FFFF'})
            .then(role => {client.settings.set(msg.guild.id, role.id, "roleonjoin")});
            roleonmsg = created
        } else roleonmsg = already
        //channels
        if(!welcomechannel) {
            msg.guild.channels.create("👋welcome", {type: 'GUILD_TEXT', 
                permissionOverwrites: [{id: msg.guild.roles.everyone.id, 
                deny: ['SEND_MESSAGES',`SEND_TTS_MESSAGES`,`EMBED_LINKS`,`ATTACH_FILES`]}]})
                .then(channel => {client.settings.set(msg.guild.id, channel.id, "welcomechannel")});
            welcomemsg = created
        } else welcomemsg = already
        if(!bcchannel) {
            msg.guild.channels.create("🔴broadcast", {type: 'GUILD_TEXT', 
                permissionOverwrites: [{id: msg.guild.roles.everyone.id, 
                deny: ['SEND_MESSAGES',`SEND_TTS_MESSAGES`,`EMBED_LINKS`,`ATTACH_FILES`]}]})
                .then(channel => {client.settings.set(msg.guild.id, channel.id, "bcchannel")});
            bcmsg = created
        } else bcmsg = already
        if(!puchannel) {
            msg.guild.channels.create("🔨punishments", {type: 'GUILD_TEXT', 
            permissionOverwrites: [{id: msg.guild.roles.everyone.id, 
            deny: ['SEND_MESSAGES',`SEND_TTS_MESSAGES`,`EMBED_LINKS`,`ATTACH_FILES`]}]})
            .then(channel => {client.settings.set(msg.guild.id, channel.id, "puchannel")});
            pumsg = created
        } else pumsg = already
        if(!reportchannel) {
            msg.guild.channels.create("🚨reports", {type: 'GUILD_TEXT', 
            permissionOverwrites: [{id: msg.guild.roles.everyone.id, 
            deny: [`VIEW_CHANNEL`]}]})
            .then(channel => {client.settings.set(msg.guild.id, channel.id, "reportchannel")});
            reportmsg = created
        } else reportmsg = already
        if(!gachannel) {
            msg.guild.channels.create("🎉giveaway", {type: 'GUILD_TEXT', 
            permissionOverwrites: [{id: msg.guild.roles.everyone.id, 
            deny: ['SEND_MESSAGES',`SEND_TTS_MESSAGES`,`EMBED_LINKS`,`ATTACH_FILES`]}]})
            .then(channel => {client.settings.set(msg.guild.id, channel.id, "gachannel")});
            gamsg = created
        } else gamsg = already
        if(!pollchannel) {
            msg.guild.channels.create("💡poll", {type: 'GUILD_TEXT', 
            permissionOverwrites: [{id: msg.guild.roles.everyone.id, 
            deny: ['SEND_MESSAGES',`SEND_TTS_MESSAGES`,`EMBED_LINKS`,`ATTACH_FILES`]}]})
            .then(channel => {client.settings.set(msg.guild.id, channel.id, "pollchannel")});
            pollmsg = created
        } else pollmsg = already
        if(!musicvocalchannel) {
            msg.guild.channels.create("🔊music", {type: 'GUILD_VOICE',
            permissionOverwrites: [{id: msg.guild.roles.everyone.id, 
            deny: ['SPEAK']}]})
            .then(channel => {client.settings.set(msg.guild.id, channel.id, "musicvocalchannel")});
            musicvocalmsg = created
        } else musicvocalmsg = already
        if(!musictextchannel) {
            msg.guild.channels.create("🎵song-request", {type: 'GUILD_TEXT', 
            permissionOverwrites: [
            {id: msg.guild.roles.everyone.id, 
            deny: ['VIEW_CHANNEL']},
            {id: musictemprole.id,
            allow: ['VIEW_CHANNEL','SEND_MESSAGES']}]})
            .then(channel => {client.settings.set(msg.guild.id, channel.id, "musictextchannel")});
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
        msg.channel.send({embeds:[setupembed]});
    }
}
