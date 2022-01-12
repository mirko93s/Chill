const Discord = require("discord.js");

module.exports = {
    name: "usercounter",
    description: "Create a User Counter channel to keep tracking how many people are in your server",
    userPerms: ['ADMINISTRATOR'],
    botPerms: ['ADMINISTRATOR'],
    options: [
        {
            name: 'mode',
            description: 'Enable or disable server stats',
            type: 'STRING',
            required: true,
            choices: [
                {name:'Enable', value:'enable'},
                {name:'Disable', value:'disable'},
            ]
        },
    ],
    run: async (client, interaction, arg) => {

        const channel = interaction.guild.channels.cache.find(c => c.id === (client.settings.get(interaction.guild.id, "usercounter")));

        switch (interaction.options.getString('mode')) {
            case 'enable':
                if (channel) {
                    const alreadyEnabledEmbed = new Discord.MessageEmbed()
                        .setColor('GREEN')
                        .setDescription(`Server Stats is already enabled and bound to ${channel}`)
                    return interaction.reply({ephemeral:true, embeds:[alreadyEnabledEmbed]});
                }
                let memberCount = interaction.guild.members.cache.filter(member => !member.user.bot).size; //filtering bots
                memberCount = client.chill.fancyNumber(memberCount);
                interaction.guild.channels.create(`📊Users: ${memberCount}`, {
                    type: 'GUILD_VOICE', 
                    permissionOverwrites: [
                        {id: interaction.guild.roles.everyone.id, 
                        deny: [`CONNECT`],
                        allow: [`VIEW_CHANNEL`]
                        }
                    ]
                })
                .then(created => {
                    client.settings.set(interaction.guild.id, created.id, "usercounter")
                    const enabledEmbed = new Discord.MessageEmbed()
                        .setColor(`GREEN`)
                        .setTitle(`Server Stats`)
                        .setDescription(`**✅ Enabled and bound to ${created}**`)
                        .setFooter({text:'From now on it will track user counter and automatically update whenever a new user joins/leaves, with a 30 minutes cooldown'})
                    return interaction.reply({embeds:[enabledEmbed]});
                });
                break;
            case 'disable':
                client.settings.delete(interaction.guild.id, "usercounter");
                if (channel) {
                    channel.delete();
                    const disabledEmbed = new Discord.MessageEmbed()
                        .setColor(`RED`)
                        .setTitle(`Server Stats`)
                        .setDescription(`**Disabled**`)
                    return interaction.reply({embeds:[disabledEmbed]});
                } else {
                    const alreadyDisabledEmbed = new Discord.MessageEmbed()
                        .setColor('RED')
                        .setDescription(`⛔ Server Stats is already disabled`)
                    return interaction.reply({ephemeral:true, embeds:[alreadyDisabledEmbed]});
                }
                break;
        }     
    }
}
