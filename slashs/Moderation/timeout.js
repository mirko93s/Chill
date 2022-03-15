const Discord = require("discord.js");
const ms = require('ms');

module.exports = {
    name: "timeout",
    description: "timemout someone in your server",
    userPerms: ['MODERATE_MEMBERS'],
    botPerms: ['VIEW_CHANNEL','MODERATE_MEMBERS','SEND_MESSAGES','EMBED_LINKS'],
    options: [
        {
            name: 'add',
            description: 'Time out someone',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'user',
                    description: 'User to timeout',
                    type: 'USER',
                    required: true,
                },
                {
                    name: 'time',
                    description: 'Timeout duration, automatically caps at 28 days',
                    type: 'INTEGER',
                    required: true,
                    minValue: 1,
                    maxValue: 60,
                },
                {
                    name: 'unit',
                    description: 'Time unit',
                    type: 'STRING',
                    required: true,
                    choices: [
                        {name:'Seconds',value:'s'},
                        {name:'Minutes',value:'m'},
                        {name:'Hours',value:'h'},
                        {name:'Days',value:'d'},
                    ]
                },
                {
                    name: 'reason',
                    description: 'Reason of the timeout',
                    type: 'STRING',
                },
                {
                    name: 'logchannel',
                    description: 'Choose where to log this timeout. If blank defaults to Guild Config Punishments channel',
                    type: 'CHANNEL',
                    channelTypes: ['GUILD_TEXT'],
                },
            ]
        },
        {
            name: 'remove',
            description: 'Remove timeout from someone',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'user',
                    description: 'User to remove the timeout from',
                    type: 'USER',
                    required: true,
                },
                {
                    name: 'reason',
                    description: 'Reason of the timeout removal',
                    type: 'STRING',
                },
                {
                    name: 'logchannel',
                    description: 'Choose where to log this timeout. If blank defaults to Guild Config Punishments channel',
                    type: 'CHANNEL',
                    channelTypes: ['GUILD_TEXT'],
                },
            ]
        },
    ],
    run: async (client, interaction, arg) => {

        const nochannelEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Punishments channel not found`)
        const notModeratableEmbed = new Discord.MessageEmbed()
            .setColor('RED')
            .setDescription(`${interaction.options.getMember('user')} can't be timed out!`)
        const noyourselfEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ You can't kick yourself`)
        const notInGuildEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ That user is not part of this Guild`)

        let puchannel = interaction.options.getChannel('logchannel') || interaction.guild.channels.cache.find(puchannel => puchannel.id === (client.settings.get(interaction.guild.id, "puchannel")));
        if (!puchannel) return interaction.reply({ephemeral:true, embeds:[nochannelEmbed]});

        const user = interaction.options.getMember('user');
        if (!user) return interaction.reply({ephemeral:true, embeds:[notInGuildEmbed]});
        if (user.id === interaction.member.id) return interaction.reply({ephemeral:true, embeds:[noyourselfEmbed]});
        if (!user.moderatable) return interaction.reply({ephemeral:true, embeds:[notModeratableEmbed]});

        const reason = interaction.options.getString('reason')?.substring(0, 1024) || '*not provided*';

        if (interaction.options.getSubcommand() === 'add') {
            let time = ms(interaction.options.getInteger('time')+interaction.options.getString('unit'));
            time>2419200000?time=2419200000:time=time; // cap time at 28 days
            user.timeout(time, reason).catch(err => {
                const errorEmbed = new Discord.MessageEmbed()
                    .setColor(`RED`)
                    .setTitle(`⛔ Error: **${err}**`)
                if (err) return interaction.reply({ephemeral:true, embeds:[errorEmbed]});
            });
            const timedoutEmbed = new Discord.MessageEmbed()
                .setColor(`YELLOW`)
                .setThumbnail(user.user.displayAvatarURL())
                .setTitle('TIMEOUT')
                .setDescription(user.user.tag)
                .addField(`By`, interaction.member.user.username, true)
                .addField(`Duration`, ms(time, {long:true}), true)
                .addField(`Reason`, reason, false)
                .setTimestamp()
            puchannel.send({embeds:[timedoutEmbed]});
        } else {
            const notTimedoutEmbed = new Discord.MessageEmbed()
                .setColor('RANDOM')
                .setDescription(`${user} is not currently timed out`)
            if (!user.isCommunicationDisabled()) return interaction.reply({ephemeral:true, embeds:[notTimedoutEmbed]});
            user.timeout(0, reason).catch(err => {
                const errorEmbed = new Discord.MessageEmbed()
                    .setColor(`RED`)
                    .setTitle(`⛔ Error: **${err}**`)
                if (err) return interaction.reply({ephemeral:true, embeds:[errorEmbed]});
            });
            const removedEmbed = new Discord.MessageEmbed()
                .setColor(`YELLOW`)
                .setThumbnail(user.user.displayAvatarURL())
                .setTitle('TIMEOUT REMOVED')
                .setDescription(user.user.tag)
                .addField(`By`, interaction.member.user.username, true)
                .addField(`Reason`, reason, false)
                .setTimestamp()
            puchannel.send({embeds:[removedEmbed]});
        }

        const doneEmbed = new Discord.MessageEmbed()
            .setColor('YELLOW')
            .setDescription(`✅ ${user}${interaction.options.getSubcommand()==='add'?' has been timed out':'\'s time out has been removed'} and logged in ${puchannel}`)
        return interaction.reply({ephemeral:true, embeds:[doneEmbed]});
    }
};