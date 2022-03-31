const Discord = require("discord.js");

module.exports = {
    name: "customcommand_list",
    description: "Get a list of all custom commands on this server",
    options: [
        {
            name: 'command',
            description: 'Custom command name to check',
            type: 'STRING',
        },
    ],
    run: async (client, interaction, arg) => {
        
        const nocmdEmbed = new Discord.MessageEmbed()
			.setColor(`RED`)
            .setTitle(`⛔ That command doesn't exist on this server!`)
        const nocmdyetEmbed = new Discord.MessageEmbed()
			.setColor(`RED`)
            .setTitle(`⛔ This server has not set any custom command yet!`)
        let ccEmbed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTitle('Custom Commands')

        let cmdmsg = "";
        if (!interaction.options.getString('command')) {
            var cmds = client.settings.get(interaction.guild.id, `customcmd`);
            if (!cmds) return interaction.reply({ephemeral:true, embeds:[nocmdyetEmbed]});
            for (const [key] of Object.entries(cmds)) {
                cmdmsg += (`\`${key}\` `);
            };
            if (cmdmsg.length<=0) return interaction.reply({ephemeral:true, embeds:[nocmdyetEmbed]});
            ccEmbed.setDescription(cmdmsg);
            return interaction.reply({embeds:[ccEmbed]});
        } else if (client.settings.has(interaction.guild.id, `customcmd.${interaction.options.getString('command')}`)) {
            cmdmsg = `\`\`\`asciidoc\n${interaction.options.getString('command')} :: ${client.settings.get(interaction.guild.id, `customcmd.${interaction.options.getString('command')}`)}\n\`\`\``;
            ccEmbed.setDescription(cmdmsg);
            return interaction.reply({ephemeral:true, embeds:[ccEmbed]});
        } else return interaction.reply({ephemeral:true, embeds:[nocmdEmbed]});
    }
}
