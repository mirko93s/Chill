const Discord = require("discord.js");
const math = require('mathjs');

module.exports = {
    name: "calc",
    aliases: ["math"],
    category: "Other",
    description: "Calculator",
    usage: "calc <expression>\n**e.g.**\n\`calc 2+2\`\n> will return 4\n\`calc (2+2)*3\`\n> will return 12\n> It is able to solve very complex calculations\n> more info at https://www.npmjs.com/package/mathjs",
    run: async (client, msg, arg) => {

        const noexpressionEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ No expression provided`)

        const expression = arg.join(" ");
        if (!expression) return msg.channel.send({embeds:[noexpressionEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
        try {
            const solved = math.evaluate(expression).toString();
            let calcEmbed = new Discord.MessageEmbed()
                .setColor(`RANDOM`)
                .setTitle(`Calc`)
                .setDescription(`${expression} = **${solved}**`)
            return msg.channel.send({embeds:[calcEmbed]});
        } catch (err) {
            const errorEmbed = new Discord.MessageEmbed()
                .setColor(`RED`)
                .setTitle(`⛔ ${err}`)
            return msg.channel.send({embeds:[errorEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
        }
    }
}
