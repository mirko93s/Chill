const Discord = require("discord.js");

module.exports = {
    name: "customcommand",
    description: "Creates a new custom command",
    userPerms: ['ADMINISTRATOR'],
    botPerms: ['VIEW_CHANNEL','SEND_MESSAGES','EMBED_LINKS'],
    options: [
        {
            name: 'create',
            description: 'Create a new custom command',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'command',
                    description: 'Set custom command name',
                    type: 'STRING',
                    required: true,
                },
                {
                    name: 'response',
                    description: 'Set custom command response',
                    type: 'STRING',
                    required: true,
                },
            ]
        },
        {
            name: 'delete',
            description: 'Delete an existing custom command',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'command',
                    description: 'Command name to be deleted',
                    type: 'STRING',
                    required: true,
                },
            ]
        },
    ],
    run: async (client, interaction, arg) => {

        const nooverrideEmbed = new Discord.MessageEmbed()
			.setColor(`RED`)
            .setTitle(`⛔ You can't override bot commands!`)
        const nocmdEmbed = new Discord.MessageEmbed()
			.setColor(`RED`)
            .setTitle(`⛔ That command doesn't exist on this server!`)
        const lengthEmbed = new Discord.MessageEmbed()
            .setColor('RED')
            .setTitle(`⛔ Command must be shorter than 32 characters. Response must be shorter than 512 characters`)
        
        if (interaction.options.getSubcommand() === 'create') {
            const command = interaction.options.getString('command');
            if (client.commands.has(command) || client.aliases.has(command)) return interaction.reply({ephemeral:true, embeds:[nooverrideEmbed]});
            const response = interaction.options.getString('response');
            if (command.length > 32 || response.length > 512) return interaction.reply({ephemeral:true, embeds:[lengthEmbed]});
            client.settings.ensure(interaction.guild.id, {customcmd: {}});
            client.settings.set(interaction.guild.id, response, `customcmd.${command}`);
            const ccEmbed = new Discord.MessageEmbed()
                .setColor('GREEN')
                .setTitle('Custom Commands')
                .setDescription(`New custom command created\n**Command:** \`${command}\`\n**Response:** \`${response}\``)
            interaction.reply({embeds:[ccEmbed]});
        } else if (interaction.options.getSubcommand() === 'delete') {
            const command = interaction.options.getString('command');
            if(!client.settings.has(interaction.guild.id, `customcmd.${command}`)) return interaction.reply({ephemeral:true, embeds:[nocmdEmbed]});
            client.settings.delete(interaction.guild.id, `customcmd.${command}`);
            const deletedEmbed = new Discord.MessageEmbed()
                .setColor('GREEN')
                .setTitle('Custom Commands')
                .setDescription(`Custom command \`${command}\` has been deleted.`)
            interaction.reply({embeds:[deletedEmbed]});
        }
        
    }
}
