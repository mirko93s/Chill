const Discord = require("discord.js");

module.exports = {
    name: "botactivity",
    aliases: ["ba"],
    category: "Owner",
    description: "Set Bot's activity",
    usage: "<message>",
    run: async (client, msg, arg) => {
        msg.delete();
        if (msg.author.id !== '278380909588381698') return msg.reply("Sorry, you don't have permission to use this!")
        let activity = arg.join(" ");
        if (!activity) return msg.reply("Please provide a valid message")
        let baEmbed = new Discord.RichEmbed()
            .setTitle("Bot Activity")
            .setDescription(activity)
            .setColor("#00ff00")
        client.user.setActivity(activity) && msg.channel.send(baEmbed)
    }
}
