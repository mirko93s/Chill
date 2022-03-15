const Discord = require("discord.js");

module.exports = {
    name: "ban",
    description: "Ban someone from your server",
    userPerms: ['BAN_MEMBERS'],
    botPerms: ['VIEW_CHANNEL','BAN_MEMBERS','SEND_MESSAGES','EMBED_LINKS'],
    options: [
        {
            name: 'user',
            description: 'User to ban',
            type: 'USER',
            required: true,
        },
        {
            name: 'reason',
            description: 'Reason of the ban',
            type: 'STRING',
        },
        {
            name: 'deletemessages',
            description: 'Number of days of messages to delete',
            type: 'INTEGER',
            minValue: 1,
            maxValue: 7,
        },
        {
            name: 'logchannel',
            description: 'Choose where to log this ban. If blank defaults to Guild Config Punishments channel',
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
            .setTitle(`⛔ You can't ban yourself`)
        const hierarchyEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ I can't ban that person due to role hierarchy.`)
        const notInGuildEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ That user is not part of this Guild`)

        let puchannel = interaction.options.getChannel('logchannel') || interaction.guild.channels.cache.find(puchannel => puchannel.id === (client.settings.get(interaction.guild.id, "puchannel")));
        if (!puchannel) return interaction.reply({ephemeral:true, embeds:[nochannelEmbed]});

        const toBan = interaction.options.getMember('user');
        if (!toBan) return interaction.reply({ephemeral:true, embeds:[notInGuildEmbed]});

        if (toBan.id === interaction.member.id) return interaction.reply({ephemeral:true, embeds:[noyourselfEmbed]});
        if (!toBan.bannable) return interaction.reply({ephemeral:true, embeds:[hierarchyEmbed]});

        const reason = interaction.options.getString('reason')?.substring(0,1024) || '*not provided*';

        const banEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setThumbnail(toBan.user.displayAvatarURL())
            .setTitle('BAN')
            .setDescription(toBan.user.tag)
            .addField(`By`, interaction.member.user.username, true)
            .addField(`Reason`, reason, false)
            .setTimestamp()

        toBan.ban({days: 0, reason: reason}).catch(err => {
            const errorEmbed = new Discord.MessageEmbed()
                .setColor(`RED`)
                .setTitle(`⛔ Error: **${err}**`)
            if (err) return interaction.reply({ephemeral:true, embeds:[errorEmbed]});
        });
        const doneEmbed = new Discord.MessageEmbed()
            .setColor('RED')
            .setDescription(`✅ ${toBan} has been banned and logged in ${puchannel}`)
        interaction.reply({ephemeral:true, embeds:[doneEmbed]});
        return puchannel.send({embeds:[banEmbed]});
    }
};
