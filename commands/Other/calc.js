const Discord = require("discord.js");
const math = require('mathjs');

module.exports = {
    name: "calc",
    aliases: ["math"],
    category: "Other",
    description: "Calculator",
    usage: "<expression>",
    run: async (client, msg, arg) => {
        msg.delete();

        const noexpressionEmbed = new Discord.RichEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ No expression provided`)

        const expression = arg.join(" ");
        if (!expression) return msg.channel.send (noexpressionEmbed).then(msg => {msg.delete(5000)});
        try {
            const solved = math.evaluate(expression).toString();
            let calcEmbed = new Discord.RichEmbed()
                .setColor(`RANDOM`)
                .setTitle(`Calc`)
                .setDescription(`${expression} = **${solved}**`)
            return msg.channel.send(calcEmbed);
        } catch (err) {
            const errorEmbed = new Discord.RichEmbed()
                .setColor(`RED`)
                .setTitle(`⛔ ${err}`)
            return msg.channel.send(errorEmbed).then(msg => {msg.delete(5000)});
        }
    }
}
