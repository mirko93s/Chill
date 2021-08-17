const Discord = require("discord.js");
const math = require('mathjs');

module.exports = {
    name: "percentage",
    aliases: ["%"],
    category: "Other",
    description: "Calculate a percentage",
    usage: "percentage <amount> <maximum>\n**e.g.**\n\`percentage 2 100\`\n> will return 50%",
    run: async (client, msg, arg) => {

        const nonumEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Error: Invalid numbers`)

        const amount = arg[0]
        const maximum = arg[1]
        if (isNaN(amount) || isNaN(maximum)) return msg.channel.send({embeds:[nonumEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));

        try {
            const percentage = math.evaluate(`(${amount}/${maximum})*100`).toString();
            const resultEmbed = new Discord.MessageEmbed()
                .setColor(`RANDOM`)
                .setTitle(`Percentage`)
                .setDescription(`${amount} is **${percentage} %** of ${maximum}`)
            return msg.channel.send({embeds:[resultEmbed]});
        } catch (err) {
            const errorEmbed = new Discord.MessageEmbed()
                .setColor(`RED`)
                .setTitle(`⛔ ${err}`)
            return msg.channel.send({embeds:[errorEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
        }
    }
}
