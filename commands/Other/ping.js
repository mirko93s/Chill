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
        
        await msg.channel.send(awaitEmbed).then(m => {
            const pingEmbed = new Discord.MessageEmbed()
                .setColor(`RANDOM`)
                .setTitle(`📶 ${m.createdTimestamp - msg.createdTimestamp} ms`)
                //client.ws.ping for API latency
    
            m.edit(pingEmbed);
        })
    }
}
