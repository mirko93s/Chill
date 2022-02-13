const Discord = require("discord.js");

module.exports = {
    name: "say",
    description: "Let the bot say something for you",
    userPerms: ['MANAGE_MESSAGES'],
    options: [
        {
            name: 'text',
            description: 'What do i have to say? (use \\n to create new lines)',
            type: 'STRING',
            required: true,
        },
        {
            name: 'embed',
            description: 'Send the message as embed',
            type: 'BOOLEAN',
        },
        {
            name: 'anonymous',
            description: 'If you want the bot message to be anonymous',
            type: 'BOOLEAN',
        },
    ],
    run: (client, interaction, arg) => {

        if (interaction.options.getBoolean('anonymous')) {
            const anonymousEmbed = new Discord.MessageEmbed()
                .setColor(`RANDOM`)
                .setDescription('✅ Message correctly sent.')
            interaction.reply({ephemeral:true, embeds:[anonymousEmbed]});
        }
        let text = '';
        interaction.options.getString('text').substring(0,2048).split('\\n').forEach(x => {
            text += x + '\n';
        });        
        
        const sayEmbed = new Discord.MessageEmbed()
            .setColor(`RANDOM`)
            .setDescription(text)

        if (interaction.options.getBoolean('embed')) {
            if (interaction.options.getBoolean('anonymous')) return interaction.channel.send({embeds:[sayEmbed]});
            else return interaction.reply({embeds:[sayEmbed]});
        } else {
            if (interaction.options.getBoolean('anonymous')) return interaction.channel.send({content:text});
            else return interaction.reply({content:text});
        }            
    }
}
