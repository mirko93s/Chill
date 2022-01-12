const Discord = require("discord.js");
const fetch = require('node-fetch');
const { URLSearchParams } = require("url");

module.exports = {
    name: "urban",
    description: "Learn the meaning of urban words",
    options: [
        {
            name: "text",
            description: "Word or Sentence to look for",
            type: 'STRING',
            required: true,
        },
    ],
    run: async (client, interaction, arg) => {

        const noresultEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Couldn't find any result`)

        try {
            const query = new URLSearchParams({term: interaction.options.getString('text').toString()});
            const body = await fetch(`https://api.urbandictionary.com/v0/define?${query}`).then(response => response.json());
            if (!body.list.length) return interaction.reply({ephemeral:true, embeds:[noresultEmbed]});
            const data = body.list[Math.floor(Math.random() * body.list.length)];
            const embed = new Discord.MessageEmbed()
                .setColor(0x32A8F0)
                .setAuthor({name:'Urban Dictionary', iconURL:'https://i.imgur.com/Fo0nRTe.png', url:'https://www.urbandictionary.com/'})
                .setURL(data.permalink)
                .setTitle(data.word)
                .setDescription((data.definition))
                .addField('Example', data.example);
            return interaction.reply({embeds:[embed]});
        } catch (err) {
            const errorEmbed = new Discord.MessageEmbed()
                .setColor(`RED`)
                .setTitle(`⛔ ${err}`)
            return interaction.reply({ephemeral:true, embeds:[errorEmbed]});
        }
    }
}
