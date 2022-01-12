const Discord = require("discord.js");

module.exports = {
    name: "autovocal_create",
    description: "Create a new auto-vocal channel",
    userPerms: ['MANAGE_CHANNELS'],
    botPerms: ['ADMINISTRATOR'],
    options: null,
    run: async (client, interaction, arg) => {
        
        interaction.guild.channels.create(`auto-vocal`, {type: 'GUILD_VOICE'}).then(channel => {
            client.settings.ensure(interaction.guild.id, defaultSettings);
            client.settings.push(interaction.guild.id, channel.id, "autovocalchannels");
            const doneEmbed = new Discord.MessageEmbed()
                .setColor(`RANDOM`)
                .setTitle(`Auto-Vocal`)
                .setDescription(`A new auto-vocal channel ${channel} has been created.\nYou can now rename it, set the permissions, users limit, bitrate, etc...`)
            interaction.reply({embeds:[doneEmbed]});
        });
        
    }
}

const defaultSettings = {
    autovocalchannels: [],
    autovocalcloned: []
}