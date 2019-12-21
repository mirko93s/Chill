const Discord = require("discord.js");

module.exports = {
    name: "botactivity",
    aliases: ["ba"],
    category: "Owner",
    description: "Set Bot's activity",
    usage: "<message>",
    permission: "DEV_ONLY",
    run: async (client, msg, arg) => {
        msg.delete();

        const nopermEmbed = new Discord.RichEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ You don't have permission to use this!`)
        const nomsgEmbed = new Discord.RichEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Please provide a valid message`)

        if (msg.author.id !== 'paste-your-ID-here') return msg.channel.send(nopermEmbed).then(msg => msg.delete(5000));
        let activity = arg.join(" ");
        if (!activity) return msg.channel.send(nomsgEmbed).then(msg => msg.delete(5000));
        let baEmbed = new Discord.RichEmbed()
            .setColor(`RANDOM`)
            .setTitle("Bot Activity")
            .setDescription(activity)
        client.user.setActivity(activity);
        msg.channel.send(baEmbed).then(msg => msg.delete(5000))
    }
}
