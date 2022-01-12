const Discord = require("discord.js");

module.exports = {
    name: "clear",
    description: "Get rid of mutiple messages at once",
    userPerms: ['MANAGE_MESSAGES'],
    botPerms: ['ADMINISTRATOR'],
    options: [
        {
            name: 'amount',
            description: 'Number of messages to delete',
            type: 'INTEGER',
            required: true,
            minValue: 2,
            maxValue: 100,
        }
    ],
    run: async (client, interaction, arg) => {

        const fetched = await interaction.channel.messages.fetch({limit: interaction.options.getInteger('amount')});
        
        await interaction.channel.bulkDelete(fetched, true).then(deleted => {
            const purgeEmbed = new Discord.MessageEmbed()
            .setColor(`GREEN`)
            .setTitle(`♻️ ${deleted.size} messages deleted`)
            if (fetched.size > deleted.size) purgeEmbed.setDescription('*Some messages have not been deleted because they are older than 14 days*')
            interaction.reply({embeds:[purgeEmbed]});
        });        
    }
}