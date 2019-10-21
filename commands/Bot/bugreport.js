const talkedRecently = new Set();
const Discord = require("discord.js");

module.exports = {
    name: "bugreport",
    aliases: ["bug"],
    category: "Bot",
    description: "Report a bug",
    usage: "<msg>",
    run: async (client, msg, arg) => {
        msg.delete();

        const cooldownEmbed = new Discord.RichEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ You already reported an issue recently, please wait another 30 minutes`)
        const tooshortEmbed = new Discord.RichEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Please provide a message`)
            .setFooter(`Message must be longer than 10 characters`)
        const thanksEmbed = new Discord.RichEmbed()
            .setColor(`GREEN`)
            .setTitle(`✅ Your report has been sent. Thanks!`)

        if (talkedRecently.has(msg.author.id)) return msg.channel.send(cooldownEmbed).then(msg => msg.delete(5000));
                        let feedback = arg.join(' ');
                            if (feedback.length < 10) return msg.reply(tooshortEmbed).then(msg => msg.delete(5000));
                        client.users.get("278380909588381698").send(":bug: BUG: " + feedback + "\nReported by " + msg.author.username);
                            msg.reply(thanksEmbed).then(msg => {msg.delete(5000)});
                    talkedRecently.add(msg.author.id);
                    setTimeout(() => {
                        talkedRecently.delete(msg.author.id);
                    }, 30 * 60000);
    }
}
