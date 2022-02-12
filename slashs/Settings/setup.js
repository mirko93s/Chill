const Discord = require("discord.js");
const { stripIndent } = require('common-tags');

module.exports = {
    name: "setup",
    description: "Setup the Bot so it can properly work on your server, creating default channels and roles",
    userPerms: ['ADMINISTRATOR'],
    botPerms: ['ADMINISTRATOR'],
    options: null,
    run: async (client, interaction, arg) => {

        let welcomechannel = interaction.guild.channels.cache.find(welcomechannel => welcomechannel.id === (client.settings.get(interaction.guild.id, "welcomechannel")));
        let bcchannel = interaction.guild.channels.cache.find(bcchannel => bcchannel.id === (client.settings.get(interaction.guild.id, "bcchannel")));
        let puchannel = interaction.guild.channels.cache.find(puchannel => puchannel.id === (client.settings.get(interaction.guild.id, "puchannel")));
        let reportchannel = interaction.guild.channels.cache.find(reportchannel => reportchannel.id === (client.settings.get(interaction.guild.id, "reportchannel")));
        let gachannel = interaction.guild.channels.cache.find(gachannel => gachannel.id === (client.settings.get(interaction.guild.id, "gachannel")));
        let pollchannel = interaction.guild.channels.cache.find(pollchannel => pollchannel.id === (client.settings.get(interaction.guild.id, "pollchannel")));
        let musicvocalchannel = interaction.guild.channels.cache.find(musicvocalchannel => musicvocalchannel.id === (client.settings.get(interaction.guild.id, "musicvocalchannel")));
        let musictextchannel = interaction.guild.channels.cache.find(musictextchannel => musictextchannel.id === (client.settings.get(interaction.guild.id, "musictextchannel")));

        let ticketcategory = interaction.guild.channels.cache.find(ticketcategory => ticketcategory.id === (client.settings.get(interaction.guild.id, "ticketcategory")));

        let musictemprole = interaction.guild.roles.cache.find(musictemprole => musictemprole.id === (client.settings.get(interaction.guild.id, "musictemprole")));
        let djrole = interaction.guild.roles.cache.find(djrole => djrole.id === (client.settings.get(interaction.guild.id, "djrole")));
        let supportrole = interaction.guild.roles.cache.find(supportrole => supportrole.id === (client.settings.get(interaction.guild.id, "supportrole")));
        let roleonjoin = interaction.guild.roles.cache.find(roleonjoin => roleonjoin.id === (client.settings.get(interaction.guild.id, "roleonjoin")));

        const created = "✅"
        const already = "❌"
        //categories
        if(!ticketcategory) {
            interaction.guild.channels.create("🎫tickets", {type: 'GUILD_CATEGORY'})
            .then(channel => {client.settings.set(interaction.guild.id, channel.id, "ticketcategory")});
            ticketmsg = created
        } else ticketmsg = already
        //roles
        if (!djrole) {
            interaction.guild.roles.create({ name: "DJ",permissions: ['CONNECT'], color: 'D00091'})
            .then(role => {client.settings.set(interaction.guild.id, role.id, "djrole")});
            djmsg = created
        } else djmsg = already
        if (!musictemprole) {
            await interaction.guild.roles.create({ name: "Listening",permissions: [], color: 'CCCC00'})
            .then(role => {
                client.settings.set(interaction.guild.id, role.id, "musictemprole")
                musictemprole = role;
            });
            musictempmsg = created
        } else musictempmsg = already
        if (!supportrole) {
            interaction.guild.roles.create({ name: "Support",permissions: [], color: 'FC72F3'})
            .then(role => {client.settings.set(interaction.guild.id, role.id, "supportrole")});
            supportmsg = created
        } else supportmsg = already
        if (!roleonjoin) {
            interaction.guild.roles.create({ name: "Member",permissions: ['VIEW_CHANNEL'], color: '33FFFF'})
            .then(role => {client.settings.set(interaction.guild.id, role.id, "roleonjoin")});
            roleonmsg = created
        } else roleonmsg = already
        //channels
        if(!welcomechannel) {
            interaction.guild.channels.create("👋welcome", {type: 'GUILD_TEXT', 
                permissionOverwrites: [{id: interaction.guild.roles.everyone.id, 
                deny: ['SEND_MESSAGES',`SEND_TTS_MESSAGES`,`EMBED_LINKS`,`ATTACH_FILES`]}]})
                .then(channel => {client.settings.set(interaction.guild.id, channel.id, "welcomechannel")});
            welcomemsg = created
        } else welcomemsg = already
        if(!bcchannel) {
            interaction.guild.channels.create("🔴broadcast", {type: 'GUILD_TEXT', 
                permissionOverwrites: [{id: interaction.guild.roles.everyone.id, 
                deny: ['SEND_MESSAGES',`SEND_TTS_MESSAGES`,`EMBED_LINKS`,`ATTACH_FILES`]}]})
                .then(channel => {client.settings.set(interaction.guild.id, channel.id, "bcchannel")});
            bcmsg = created
        } else bcmsg = already
        if(!puchannel) {
            interaction.guild.channels.create("🔨punishments", {type: 'GUILD_TEXT', 
            permissionOverwrites: [{id: interaction.guild.roles.everyone.id, 
            deny: ['SEND_MESSAGES',`SEND_TTS_MESSAGES`,`EMBED_LINKS`,`ATTACH_FILES`]}]})
            .then(channel => {client.settings.set(interaction.guild.id, channel.id, "puchannel")});
            pumsg = created
        } else pumsg = already
        if(!reportchannel) {
            interaction.guild.channels.create("🚨reports", {type: 'GUILD_TEXT', 
            permissionOverwrites: [{id: interaction.guild.roles.everyone.id, 
            deny: [`VIEW_CHANNEL`]}]})
            .then(channel => {client.settings.set(interaction.guild.id, channel.id, "reportchannel")});
            reportmsg = created
        } else reportmsg = already
        if(!gachannel) {
            interaction.guild.channels.create("🎉giveaway", {type: 'GUILD_TEXT', 
            permissionOverwrites: [{id: interaction.guild.roles.everyone.id, 
            deny: ['SEND_MESSAGES',`SEND_TTS_MESSAGES`,`EMBED_LINKS`,`ATTACH_FILES`]}]})
            .then(channel => {client.settings.set(interaction.guild.id, channel.id, "gachannel")});
            gamsg = created
        } else gamsg = already
        if(!pollchannel) {
            interaction.guild.channels.create("💡poll", {type: 'GUILD_TEXT', 
            permissionOverwrites: [{id: interaction.guild.roles.everyone.id, 
            deny: ['SEND_MESSAGES',`SEND_TTS_MESSAGES`,`EMBED_LINKS`,`ATTACH_FILES`]}]})
            .then(channel => {client.settings.set(interaction.guild.id, channel.id, "pollchannel")});
            pollmsg = created
        } else pollmsg = already
        if(!musicvocalchannel) {
            interaction.guild.channels.create("🔊music", {type: 'GUILD_VOICE',
            permissionOverwrites: [{id: interaction.guild.roles.everyone.id, 
            deny: ['SPEAK']}]})
            .then(channel => {client.settings.set(interaction.guild.id, channel.id, "musicvocalchannel")});
            musicvocalmsg = created
        } else musicvocalmsg = already
        if(!musictextchannel) {
            interaction.guild.channels.create("🎵song-request", {type: 'GUILD_TEXT', 
            permissionOverwrites: [
            {id: interaction.guild.roles.everyone.id, 
            deny: ['VIEW_CHANNEL']},
            {id: musictemprole.id,
            allow: ['VIEW_CHANNEL','SEND_MESSAGES']}]})
            .then(channel => {client.settings.set(interaction.guild.id, channel.id, "musictextchannel")});
            musictextmsg = created
        } else musictextmsg = already

        const channels = stripIndent`
        ${welcomemsg} | Welcome     | ${interaction.guild.channels.cache.find(c => c.id === (client.settings.get(interaction.guild.id, "welcomechannel"))).name}
        ${bcmsg} | Broadcast   | ${interaction.guild.channels.cache.find(c => c.id === (client.settings.get(interaction.guild.id, "bcchannel"))).name}
        ${pumsg} | Punishments | ${interaction.guild.channels.cache.find(c => c.id === (client.settings.get(interaction.guild.id, "puchannel"))).name}
        ${reportmsg} | Reports     | ${interaction.guild.channels.cache.find(c => c.id === (client.settings.get(interaction.guild.id, "reportchannel"))).name}
        ${gamsg} | Giveaway    | ${interaction.guild.channels.cache.find(c => c.id === (client.settings.get(interaction.guild.id, "gachannel"))).name}
        ${pollmsg} | Poll        | ${interaction.guild.channels.cache.find(c => c.id === (client.settings.get(interaction.guild.id, "pollchannel"))).name}
        ${musicvocalmsg} | Music Voice | ${interaction.guild.channels.cache.find(c => c.id === (client.settings.get(interaction.guild.id, "musicvocalchannel"))).name}
        ${musictextmsg} | Music Text  | ${interaction.guild.channels.cache.find(c => c.id === (client.settings.get(interaction.guild.id, "musictextchannel"))).name}
        `;
        
        const roles = stripIndent`
        ${djmsg} | DJ         | ${interaction.guild.roles.cache.find(r => r.id === (client.settings.get(interaction.guild.id, "djrole"))).name}
        ${musictempmsg} | Music Temp | ${interaction.guild.roles.cache.find(r => r.id === (client.settings.get(interaction.guild.id, "musictemprole"))).name}
        ${supportmsg} | Support    | ${interaction.guild.roles.cache.find(r => r.id === (client.settings.get(interaction.guild.id, "supportrole"))).name}
        ${roleonmsg} | On Join    | ${interaction.guild.roles.cache.find(r => r.id === (client.settings.get(interaction.guild.id, "roleonjoin"))).name}
        `;
        
        const categories = stripIndent`
		${ticketmsg} | Ticket | ${interaction.guild.channels.cache.find(c => c.id === (client.settings.get(interaction.guild.id, "ticketcategory"))).name}
		`;

        let setupembed = new Discord.MessageEmbed()
            .setTitle("**SETUP**")
            .setColor(`RANDOM`)
            .setThumbnail(client.user.displayAvatarURL())
            .addField(`**Channels**`, `\`\`\`${channels}\`\`\``, false)
            .addField(`**Roles**`, `\`\`\`${roles}\`\`\``, false)
            .addField(`**Categories**`, `\`\`\`${categories}\`\`\``, false)
            .setFooter({text: `${created} Created\n${already} Already exists`})
        interaction.reply({embeds:[setupembed]});
    }
}
