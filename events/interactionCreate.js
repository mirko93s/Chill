const Discord = require("discord.js");

module.exports = async(client, interaction) => {
    const devID = require('../config.json').bot_owner;
    if (!interaction.isApplicationCommand()) return;
    if (interaction.channel.type === "DM") {
        const noDmsEmbed = new Discord.MessageEmbed()
            .setColor('RED')
            .setDescription('⛔ You can\'t use slash commands in DMs')
        return interaction.followUp({embeds:[noDmsEmbed]});
    }
    // get command
    const command = client.slashs.get(interaction.commandName);
    if (!command) return interaction.reply({ephemeral:true, content: 'An error occured while trying to execute that command!' });
    // check if dev only
    const noDevEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setDescription(`⛔ This command is limited to the bot Developer!`)
    if (command.dev && interaction.member.user.id !== devID) return interaction.reply({ephemeral:true, embeds:[noDevEmbed]});
    // check user perms
    if (command.userPerms) {
        if (!client.guilds.cache.get(interaction.guild.id).members.cache.get(interaction.member.id).permissions.has(command.userPerms || [])) {
            const noPermEmbed = new Discord.MessageEmbed()
                .setColor(`RED`)
                .setDescription(`⛔ You need the \`${command.userPerms.join('` `')}\` permission${command.userPerms.length>1?'s':''} to use this command!`)
            return interaction.reply({ephemeral:true, embeds:[noPermEmbed]});
        }
    }
    // check bot perms
    if (command.botPerms) {
        if (!client.guilds.cache.get(interaction.guild.id).members.cache.get(client.user.id).permissions.has(command.botPerms || [])) {
            const noBotPermEmbed = new Discord.MessageEmbed()
                .setColor(`RED`)
                .setDescription(`⛔ I need the \`${command.botPerms.join('` `')}\` permission${command.botPerms.length>1?'s':''} to use this command!`)
            return interaction.reply({ephemeral:true, embeds:[noBotPermEmbed]});
        }
    } 
    // subcommand check
    const args = [];
    for (let option of interaction.options.data) {
        if (option.type === 'SUB_COMMAND') {
            if (option.name) args.push(option.name);
            option.options?.forEach(x =>  {
                if (x.value) args.push(x.value);
            });
        } else if (option.value) args.push(option.value);
    }
    // run slash command
    try {
        if (client.settings.includes(interaction.guild.id, command.name, "disabledcommands")) return interaction.reply({ephemeral:true, content: `\`${command.name}\` has been disabled on this server by an Administrator!`}); //check if command is disabled on the guild
        await command.run(client, interaction, args)
        client.cmdstats.inc('usage',command.name);
    } catch (err) {
        console.log(err);
        interaction.reply({ephemeral:true, content: '**ERROR: **'+err.message });
    }
}
