const Discord = require("discord.js");

module.exports = {
    name: "say",
    description: "Let the Bot say something for you",
    usage: "[embed] <message>",
    permission: "MANAGE_MESSAGES",
    run: (client, message, args) => {
        message.delete();

        const nopermEmbed = new Discord.RichEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ You don't have permission to use this!`)
        const nomsgEmbed = new Discord.RichEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Please provide a message`)

        if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(nopermEmbed).then(m => m.delete(5000));
        if (!args[0]) return message.channel.send(nomsgEmbed).then(m => m.delete(5000));
        if (args[0] === "embed") {
            const embed = new Discord.RichEmbed()
                .setColor(`RANDOM`)
                .setDescription(args.slice(1).join(" "))

            message.channel.send(embed);
        }
        else {
            message.channel.send(args.join(" "));
        }
    }
}