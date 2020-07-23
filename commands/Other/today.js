const Discord = require("discord.js");
const snekfetch = require('snekfetch');

module.exports = {
    name: "today",
    category: "Other",
    description: "History lessons",
    usage: "today\n**e.g.**\n\`today\`\n> Get a random fact that took place today",
    run: async (client, msg, arg) => {
        msg.delete();
        const { text } = await snekfetch
            .get('http://history.muffinlabs.com/date');
            const body = JSON.parse(text);
            const events = body.data.Events;
            const event = events[Math.floor(Math.random() * events.length)];
            const embed = new Discord.RichEmbed()
                .setColor(0x00A2E8)
                .setURL(body.url)
                .setTitle(`On this day (${body.date})...`)
                .setTimestamp()
                .setDescription(`${event.year}: ${event.text}`);
            return msg.channel.send(embed).catch(console.error);
    }
}