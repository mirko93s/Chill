const Discord = require("discord.js");

module.exports = {
    name: "ping",
    aliases: ["latency"],
    category: "Other",
    description: "Returns latency/ping in ms",
    usage: "ping\n**e.g.**\n\`ping\`\n> will return your latency (e.g. 123ms)",
    run: async (client, msg, arg) => {

        const awaitEmbed = new Discord.MessageEmbed()
            .setColor(`RANDOM`)
            .setTitle(`📶 Calculating . . .`)
        await msg.channel.send({embeds:[awaitEmbed]}).then(sent => {
            const pingEmbed = new Discord.MessageEmbed()
                .setColor(`RANDOM`)
                .setTitle(`📶 ${sent.createdTimestamp - msg.createdTimestamp} ms`)
                .setDescription(`\`API: ${client.ws.ping} ms\``)
    
            sent.edit({embeds:[pingEmbed]});
        })
    }
}
