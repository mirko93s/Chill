const talkedRecently = new Set();
const Discord = require("discord.js");
const config = require('../../config.json');

module.exports = {
    name: "bugreport",
    aliases: ["bug"],
    category: "Bot",
    description: "Report a bug to the dev",
    usage: "bugreport <message>\n**e.g.**\n\`bugreport ping command is not working\`\n> It will send an embed to the dev's discord server with your message\n> Please provide a good explanation of the bug and if you can the steps to reproduce it.",
    run: async (client, msg, arg) => {
        msg.delete();

        const cooldownEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ You already reported an issue recently, please wait another 30 minutes`)
        const tooshortEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Please provide a message`)
            .setFooter(`Message must be longer than 10 characters`)
        const thanksEmbed = new Discord.MessageEmbed()
            .setColor(`GREEN`)
            .setTitle(`✅ Your bug report has been sent. Thanks!`)

        if (talkedRecently.has(msg.author.id)) return msg.channel.send(cooldownEmbed).then(msg => msg.delete({ timeout: 5000 }));
                        let feedback = arg.join(' ');
                            if (feedback.length < 10) return msg.reply(tooshortEmbed).then(msg => msg.delete({ timeout: 5000 }));

                        const bugembed = new Discord.MessageEmbed()
                        .setColor(`RED`)
                        .setAuthor(`🐛Bug Report`)
                        .setTitle(`> ${feedback}`)
                        .setDescription(`*by: ${msg.author.tag}*`)
                        .setTimestamp()

                        client.channels.cache.get(config.bugreport_channel).send(bugembed).then(sentEmbed => {
                            sentEmbed.react("✅")
                            .then (() => sentEmbed.react("❔"))
                            .then (() => sentEmbed.react("❌"))
                        });
                            msg.reply(thanksEmbed).then(msg => {msg.delete({ timeout: 5000 })});
                    talkedRecently.add(msg.author.id);
                    setTimeout(() => {
                        talkedRecently.delete(msg.author.id);
                    }, 30 * 60000);
    }
}
