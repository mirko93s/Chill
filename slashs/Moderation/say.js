const Discord = require("discord.js");

module.exports = {
    name: "say",
    description: "Let the bot say something for you",
    userPerms: ['MANAGE_MESSAGES'],
    options: [
        {
            name: 'text',
            description: 'What do i have to say?',
            type: 'STRING',
            required: true,
        },
        {
            name: 'embed',
            description: 'True if you want the message to be sent as a cool embed',
            type: 'BOOLEAN',
        },
    ],
    run: (client, interaction, arg) => {

        if (!interaction.options.getBoolean('embed')) return interaction.reply({content:interaction.options.getString('text')});
            else {
                const embed = new Discord.MessageEmbed()
                    .setColor(`RANDOM`)
                    .setDescription(interaction.options.getString('text').substring(0,2048))
                interaction.reply({embeds:[embed]});
            }
    }
}