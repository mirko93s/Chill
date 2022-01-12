const Discord = require("discord.js");

module.exports = {
    name: "ping",
    description: "Get the bot's ping",
    options: null,
    run: async (client, interaction, arg) => {

        let start = Date.now();
        const awaitEmbed = new Discord.MessageEmbed()
            .setColor(`RANDOM`)
            .setTitle(`📶 Calculating . . .`)
        
        await interaction.reply({embeds: [awaitEmbed]});
        let end = Date.now();
        
        const pingEmbed = new Discord.MessageEmbed()
            .setColor(`RANDOM`)
            .setTitle(`📶 ${end-start} ms`)
            .setDescription(`\`API: ${client.ws.ping} ms\``)

        interaction.editReply({ embeds: [pingEmbed] });
    }
}