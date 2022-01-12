const Discord = require("discord.js");
const math = require('mathjs');

module.exports = {
    name: "calc",
    description: "Calculator",
    options: [
        {
            name: "expression",
            description: "Expression to calculate",
            type: 'STRING',
            required: true,
        },
    ],
    run: async (client, interaction, arg) => {

        const noexpressionEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ No expression provided`)
        const tooLongEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Expression must be shorter than 512 characters`)

        const expression = interaction.options.getString('expression');
        if (expression.length > 512) return interaction.reply({ephemeral:true, embeds:[tooLongEmbed]});
        if (!expression) return interaction.reply({ephemeral:true, embeds:[noexpressionEmbed]});
        try {
            const solved = math.evaluate(expression).toString();
            let calcEmbed = new Discord.MessageEmbed()
                .setColor(`RANDOM`)
                .setTitle(`Calc`)
                .setDescription(`${expression} = **${solved}**`)
            return interaction.reply({embeds:[calcEmbed]});
        } catch (err) {
            const errorEmbed = new Discord.MessageEmbed()
                .setColor(`RED`)
                .setTitle(`⛔ ${err}`)
            return interaction.reply({ephemeral:true, embeds:[errorEmbed]});
        }
    }
}
