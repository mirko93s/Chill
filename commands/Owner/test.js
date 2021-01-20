const Discord = require("discord.js");

module.exports = {
    name: "test",
    category: "_",
    description: "_",
    usage: "_",
    permission: "_",
    run: async (client, msg, arg) => {
        if (msg.author.id !== config.bot_owner) return msg.channel.send(nopermEmbed).then(msg => msg.delete({ timeout: 5000 }));
        
    }
}
