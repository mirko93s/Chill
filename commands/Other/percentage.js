const Discord = require("discord.js");
const math = require('mathjs');

module.exports = {
    name: "percentage",
    aliases: ["%"],
    category: "Other",
    description: "Calculate a percentage",
    usage: "<amount> <maximum>",
    run: async (client, msg, arg) => {
        msg.delete();

        const nonumEmbed = new Discord.RichEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Error: Invalid numbers`)

        const amount = arg[0]
        const maximum = arg[1]

        try {
            const percentage = math.evaluate(`(${amount}/${maximum})*100`).toString();
            const resultEmbed = new Discord.RichEmbed()
                .setColor(`RANDOM`)
                .setTitle(`Percentage`)
                .setDescription(`${amount} is **${percentage} %** of ${maximum}`)
            return msg.channel.send(resultEmbed);
        } catch (err) {
            const errorEmbed = new Discord.RichEmbed()
                .setColor(`RED`)
                .setTitle(`⛔ ${err}`)
            return msg.channel.send(errorEmbed).then(msg => {msg.delete(5000)});
        }
    }
}
