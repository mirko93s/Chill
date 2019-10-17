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
        const expression = arg.join(" ");
        if (!expression) return msg.reply ("no expression");
        try {
            const solved = math.evaluate(expression).toString();
            return msg.channel.send(":arrow_right: " + expression + " = " + solved);
        } catch (err) {
            return msg.channel.send('Error: ' + err);
        }
    }
}
