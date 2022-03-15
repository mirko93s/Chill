const Discord = require("discord.js");

module.exports = {
    name: "kick",
    description: "Kick someone from your server",
    userPerms: ['KICK_MEMBERS'],
    botPerms: ['VIEW_CHANNEL','KICK_MEMBERS','SEND_MESSAGES','EMBED_LINKS'],
    options: [
        {
            name: 'user',
            description: 'User to kick',
            type: 'USER',
            required: true,
        },
        {
            name: 'reason',
            description: 'Reason of the kick',
            type: 'STRING',
        },
        {
            name: 'logchannel',
            description: 'Choose where to log this kick. If blank defaults to Guild Config Punishments channel',
            type: 'CHANNEL',
            channelTypes: ['GUILD_TEXT'],
        },
    ],
    run: async (client, interaction, arg) => {

        const nochannelEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Punishments channel not found`)
        const noyourselfEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ You can't kick yourself`)
        const hierarchyEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ I can't kick that person due to role hierarchy.`)
        const notInGuildEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ That user is not part of this Guild`)

        let puchannel = interaction.options.getChannel('logchannel') || interaction.guild.channels.cache.find(puchannel => puchannel.id === (client.settings.get(interaction.guild.id, "puchannel")));
        if (!puchannel) return interaction.reply({ephemeral:true, embeds:[nochannelEmbed]});

        const toKick = interaction.options.getMember('user');        
        if (!toKick) return interaction.reply({ephemeral:true, embeds:[notInGuildEmbed]});

        if (toKick.id === interaction.member.id) return interaction.reply({ephemeral:true, embeds:[noyourselfEmbed]});
        if (!toKick.kickable) return interaction.reply({ephemeral:true, embeds:[hierarchyEmbed]});

        const reason = interaction.options.getString('reason')?.substring(0,1024) || '*not provided*';

        const kickEmbed = new Discord.MessageEmbed()
            .setColor(`ORANGE`)
            .setThumbnail(toKick.user.displayAvatarURL())
            .setTitle('KICK')
            .setDescription(toKick.user.tag)
            .addField(`By`, interaction.member.user.username, true)
            .addField(`Reason`, reason, false)
            .setTimestamp()

        toKick.kick({reason: reason}).catch(err => {
            const errorEmbed = new Discord.MessageEmbed()
                .setColor(`RED`)
                .setTitle(`⛔ Error: **${err}**`)
            if (err) return interaction.reply({ephemeral:true, embeds:[errorEmbed]});
        });
        const doneEmbed = new Discord.MessageEmbed()
            .setColor('ORANGE')
            .setDescription(`✅ ${toKick} has been kicked and logged in ${puchannel}`)
        interaction.reply({ephemeral:true, embeds:[doneEmbed]});
        return puchannel.send({embeds:[kickEmbed]});
    }
};
