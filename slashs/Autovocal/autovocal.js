const Discord = require("discord.js");

module.exports = {
    name: "autovocal",
    description: "Lock your Auto-Vocal channel and invite/kick people to/from it",
    botPerms: ['ADMINISTRATOR'],
    options: [
        {
            name: 'lock',
            description: 'Lock your auto-vocal channel so only the users you whitelist will be able to join',
            type: 'SUB_COMMAND',
        },
        {
            name: 'invite',
            description: 'Whitelist a friend in your auto-vocal channel',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'user',
                    description: 'User to invite',
                    type: 'USER',
                    required: true,
                },
            ]
        },
        {
            name: 'kick',
            description: 'Kick somoene out of your auto-vocal channel, removing him from the whitelist',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'user',
                    description: 'User to kick',
                    type: 'USER',
                    required: true,
                },
            ]
        },
    ],
    run: async (client, interaction, arg) => {
        // invite
        const noavchannelEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ You are not in an Auto-Vocal channel.`)
        const notRoleSelfEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ You can't whitelist other people since you are not whitelisted yourself.`)
        const alreadyEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ That person is already whitelisted.`)
        const alreadyKickedEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ That person is already not whitelisted.`)
        const notlockedEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ This Auto-Vocal channel is not locked yet.`)
        const nocreatorEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ You don't have permission to use this!\nOnly the creator of this channel can lock it or kick people out of it.`)
        const alreadylockedEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ This Auto-Vocal channel is already locked.`)

        let temprole = interaction.guild.roles.cache.find(role => role.name === (`av-${interaction.member.voice.channelId}`));

        switch (interaction.options.getSubcommand()) {
            case 'lock':
                if (temprole) return interaction.reply({ephemeral:true, embeds:[alreadylockedEmbed]});
                if (client.settings.includes(interaction.guild.id, interaction.member.voice.channelId, "autovocalcloned")) {
                    if (interaction.member.voice.channel.name.includes(interaction.user.username)) {
                        interaction.guild.roles.create({name: `av-${interaction.member.voice.channelId}`,color: '000000'}).then(temprole => {

                            interaction.guild.channels.cache.get(interaction.member.voice.channelId).members.forEach((member) => {
                                member.roles.add(temprole.id);
                            })
                            interaction.member.voice.channel.permissionOverwrites.edit(temprole.id, {
                                VIEW_CHANNEL: true,
                                SPEAK: true,
                                STREAM: true,
                                CONNECT: true
                            });
                            interaction.member.voice.channel.permissionOverwrites.edit(interaction.guild.roles.everyone.id, {
                                VIEW_CHANNEL: false,
                                SPEAK: false,
                                CONNECT: false
                            });
                        });
                        const lockedEmbed = new Discord.MessageEmbed()
                            .setColor('RANDOM')
                            .setTitle('🔒Channel Locked')
                            .setDescription('You can now invite other users to join this auto-vocal channel by doing `.autovocalinvite @user`.')
                        interaction.reply({embeds:[lockedEmbed]});
                    } else return interaction.reply({ephemeral:true, embeds:[nocreatorEmbed]});
                } else return interaction.reply({ephemeral:true, embeds:[noavchannelEmbed]});
                break;
            case 'invite':
                if (!temprole) return interaction.reply({ephemeral:true, embeds:[notlockedEmbed]});
                if (client.settings.includes(interaction.guild.id, interaction.member.voice.channelId, "autovocalcloned")) {
                    if (interaction.member.roles.cache.find(temprole => temprole.name === ("av-"+interaction.member.voice.channelId))) {
                        let invited = interaction.options.getMember('user');
                        if (invited.roles.cache.some(role => role.id === temprole.id)) return interaction.reply({ephemeral:true, embeds:[alreadyEmbed]});
                        invited.roles.add(temprole.id);
                        const invitedEmbed = new Discord.MessageEmbed()
                            .setColor('RANDOM')
                            .setDescription(`${invited} has been whitelisted in your Auto-Vocal channel`)
                            .setFooter({text:`by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL()})
                        interaction.reply({embeds:[invitedEmbed]});
                    } else return interaction.reply({ephemeral:true, embeds:[notRoleSelfEmbed]});
                } else return interaction.reply({ephemeral:true, embeds:[noavchannelEmbed]});
                break;
            case 'kick':
                if (!temprole) return interaction.reply({ephemeral:true, embeds:[notlockedEmbed]});
                if (client.settings.includes(interaction.guild.id, interaction.member.voice.channelId, "autovocalcloned")) {
                    if (interaction.member.voice.channel.name.includes(interaction.user.username)) {
                        let invited = interaction.options.getMember('user');
                        if (!invited.roles.cache.some(role => role.id === temprole.id)) return interaction.reply({ephemeral:true, emebds:[alreadyKickedEmbed]});
                        invited.roles.remove(temprole.id);
                        invited.voice.disconnect();
                        const kickedEmbed = new Discord.MessageEmbed()
                            .setColor('RANDOM')
                            .setDescription(`${invited} has been removed from the whitelist of your Auto-Vocal channel.`)
                            .setFooter({text:`by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL()})
                        interaction.reply({embeds:[kickedEmbed]});
                    } else return interaction.reply({ephemeral:true, embeds:[nocreatorEmbed]});
                }else return interaction.reply({ephemeral:true, embeds:[noavchannelEmbed]});
                break;
        }
    }
}
