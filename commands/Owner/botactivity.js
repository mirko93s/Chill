const Discord = require("discord.js");
const config = require('../../config.json');

module.exports = {
    name: "botactivity",
    aliases: ["ba"],
    category: "Owner",
    description: "Set Bot's activity",
    usage: "botactivity <message>\n**e.g.**\n\`botactivity cat videos\`\n> will change the bot activity to \"watching cat videos\"\n> It is limited to the Bot Dev only, because the set activity is shared between all servers the bot is a part of\n> Also the acitvity is automatically updated every 30 minutes to count the number of servers, so the change will only be temporary",
    permission: "DEV",
    run: async (client, msg, arg) => {

        const nopermEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ You don't have permission to use this!`)
        const nomsgEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Please provide a valid message`)

        if (msg.author.id !== config.bot_owner) return msg.channel.send(nopermEmbed).then(msg => msg.delete({ timeout: 5000 }));
        let activity = arg.join(" ");
        if (!activity) return msg.channel.send(nomsgEmbed).then(msg => msg.delete({ timeout: 5000 }));
        let baEmbed = new Discord.MessageEmbed()
            .setColor(`RANDOM`)
            .setTitle("Bot Activity")
            .setDescription(activity)
        client.user.setActivity(activity);
        msg.channel.send(baEmbed).then(msg => msg.delete({ timeout: 5000 }))
    }
}
