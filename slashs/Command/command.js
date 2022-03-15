const Discord = require("discord.js");

module.exports = {
    name: "command",
    description: "Enable/Disable a command on this server",
    userPerms: ['ADMINISTRATOR'],
    options: [
        {
            name: 'enable',
            description: 'Enable a command',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'command',
                    description: 'Command to enable',
                    type: 'STRING',
                    required: true,
                },
            ]
        },
        {
            name: 'disable',
            description: 'Disable a command',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'command',
                    description: 'Command to disable',
                    type: 'STRING',
                    required: true,
                },
            ]
        },
        {
            name: 'listdisabled',
            description: 'List all disabled commands',
            type: 'SUB_COMMAND',
            options: null,
        },
    ],
    run: async (client, interaction, arg) => {

        const nocmdEmbed = new Discord.MessageEmbed()
			.setColor(`RED`)
            .setTitle(`⛔ That command doesn't exist!`)
        const alreadydisabledEmbed = new Discord.MessageEmbed()
			.setColor(`RED`)
            .setTitle(`⛔ That command is already disabled on this server!`)
        const alreadyenabledEmbed = new Discord.MessageEmbed()
			.setColor(`RED`)
            .setTitle(`⛔ That command is already enabled on this server!`)
        const nodisabledcmdsEmbed = new Discord.MessageEmbed()
			.setColor(`RED`)
            .setTitle(`⛔ There are no commands disabled on this server!`)
        //check command
        const _command = interaction.options.getString('command');
        let command = client.commands.get(_command) || client.aliases.get(_command) || client.slashs.get(_command);

        switch (interaction.options.getSubcommand()) {
            case 'enable':
                if (!command) return interaction.reply({ephemeral:true, embeds:[nocmdEmbed]});
                if (client.settings.includes(interaction.guild.id, command.name, "disabledcommands")) {
                    client.settings.remove(interaction.guild.id, command.name, "disabledcommands");
                    const enabledEmbed = new Discord.MessageEmbed()
                        .setColor(`GREEN`)
                        .setTitle(`✅ \`${command.name}\` has been enabled again on this server.`)
                    return interaction.reply({embeds:[enabledEmbed]});
                } else return interaction.reply({ephemeral:true, embeds:[alreadyenabledEmbed]});
                break;
            case 'disable':
                if (!command) return interaction.reply({ephemeral:true, embeds:[nocmdEmbed]});
                if (!client.settings.includes(interaction.guild.id, command.name, "disabledcommands")) {
                    client.settings.push(interaction.guild.id, command.name, "disabledcommands");
                    const disabledEmbed = new Discord.MessageEmbed()
                        .setColor(`RED`)
                        .setTitle(`❌ \`${command.name}\` has been disabled on this server.`)
                    return interaction.reply({embeds:[disabledEmbed]});
                } else return interaction.reply({ephemeral:true, embeds:[alreadydisabledEmbed]});
                break;
            case 'listdisabled':
                const disabledcommands = client.settings.get(interaction.guild.id, "disabledcommands");
                if (disabledcommands.length <= 0) return interaction.reply({ephemeral:true, embeds:[nodisabledcmdsEmbed]});
                const disabledEmbed = new Discord.MessageEmbed()
                    .setColor('RANDOM')
                    .setTitle('Disabled Commands')
                let disabledmsg = "";
                disabledcommands.forEach(cmd => {
                    disabledmsg += (`\`${cmd}\` `);
                });
                disabledEmbed.setDescription(disabledmsg);
                return interaction.reply({embeds:[disabledEmbed]});
                break;
        }
    }
}
