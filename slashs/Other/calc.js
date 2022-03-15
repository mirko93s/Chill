const Discord = require("discord.js");
const fetch = require('node-fetch');

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

        await interaction.deferReply();

        const badRequestEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ The expression provided was invalid!`)
        const tooLongEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Expression must be shorter than 512 characters`)
        const serviceDownEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Calculator is unavailable at the moment, please try again in a few seconds!`)
            
        const expression = interaction.options.getString('expression');
        if (expression.length > 512) return interaction.followUp({ephemeral:true, embeds:[tooLongEmbed]});

        fetch(`http://api.mathjs.org/v4/?expr=${encodeURIComponent(expression)}`).then(response => {
            switch(response.status) {
                case 200: // OK
                    try {
                        response.json().then(result => {
                            let calcEmbed = new Discord.MessageEmbed()
                                .setColor(`RANDOM`)
                                .setTitle(`Calc`)
                                .setDescription(`${expression} = **${result}**`)
                            return interaction.followUp({embeds:[calcEmbed]});
                        }).catch(() => {return interaction.followUp({ephemeral:true, embeds:[badRequestEmbed]})});
                    } catch (err) {
                        return interaction.followUp({ephemeral:true, embeds:[badRequestEmbed]});
                    }
                    break;
                case 400: // BAD REQUEST
                    return interaction.followUp({ephemeral:true, embeds:[badRequestEmbed]});
                    break;
                case 503: // SERVICE UNAVAILABLE
                    return interaction.followUp({ephemeral:true, embeds:[serviceDownEmbed]});
                    break;
            }
        }).catch(() => {return})
    }
}