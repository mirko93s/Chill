const Discord = require("discord.js");

module.exports = {
    name: "percentage",
    description: "Calculate a percentage",
    options: [
        {
            name: "x",
            description: "First number",
            type: 'NUMBER',
            required: true,
        },
        {
            name: "y",
            description: "Second number",
            type: 'NUMBER',
            required: true,
        },
    ],
    run: async (client, interaction, arg) => {

        const x = interaction.options.getNumber('x');
        const y = interaction.options.getNumber('y');

        try {
            const resultEmbed = new Discord.MessageEmbed()
                .setColor(`RANDOM`)
                .setTitle(`Percentage`)
                .setDescription(`${x} is **${(x/y*100).toFixed(2)} %** of ${y}`)
            return interaction.reply({embeds:[resultEmbed]});
        } catch (err) {
            const errorEmbed = new Discord.MessageEmbed()
                .setColor(`RED`)
                .setTitle(`⛔ ${err}`)
            return interaction.reply({ephemeral:true, embeds:[errorEmbed]});
        }
    }
}
