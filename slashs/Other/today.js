const Discord = require("discord.js");
const fetch = require('node-fetch');

module.exports = {
    name: "today",
    description: "Shows a random historycal fact happened on this day",
    options: null,
    run: async (client, interaction, arg) => {

        const text = await fetch('http://history.muffinlabs.com/date')
            .then(response => response.json());
        const events = text.data.Events;
        const event = events[Math.floor(Math.random() * events.length)];
        const embed = new Discord.MessageEmbed()
            .setColor(0x00A2E8)
            .setURL(text.url)
            .setTitle(`On this day (${text.date})...`)
            .setTimestamp()
            .setDescription(`${event.year}: ${event.text}`);
        return interaction.reply({embeds:[embed]}).catch(console.error);
    }
}