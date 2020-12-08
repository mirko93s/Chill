const Discord = require("discord.js");
const math = require('mathjs');

module.exports = {
    name: "percentage",
    aliases: ["%"],
    category: "Other",
    description: "Calculate a percentage",
    usage: "percentage <amount> <maximum>\n**e.g.**\n\`percentage 2 100\`\n> will return 50%",
    run: async (client, msg, arg) => {
        msg.delete();

        const nonumEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Error: Invalid numbers`)

        const amount = arg[0]
        const maximum = arg[1]

        try {
            const percentage = math.evaluate(`(${amount}/${maximum})*100`).toString();
            const resultEmbed = new Discord.MessageEmbed()
                .setColor(`RANDOM`)
                .setTitle(`Percentage`)
                .setDescription(`${amount} is **${percentage} %** of ${maximum}`)
            return msg.channel.send(resultEmbed);
        } catch (err) {
            const errorEmbed = new Discord.MessageEmbed()
                .setColor(`RED`)
                .setTitle(`⛔ ${err}`)
            return msg.channel.send(errorEmbed).then(msg => {msg.delete({ timeout: 5000 })});
        }
    }
}
