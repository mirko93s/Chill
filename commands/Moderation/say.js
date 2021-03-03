const Discord = require("discord.js");

module.exports = {
    name: "say",
    description: "Let the Bot say something for you",
    usage: "say [embed] <message>\n**e.g.**\n\`say hello\`\n> The Bot will send a normal \"hello\" message\n\`say embed hello\`\n> The Bot will send an embedded \"hello\" message",
    permission: "MANAGE_MESSAGES",
    run: (client, msg, arg) => {

        const nopermEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ You don't have permission to use this!`)
        const nomsgEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Please provide a message`)

        if (!msg.member.hasPermission("MANAGE_MESSAGES")) return msg.channel.send(nopermEmbed).then(m => m.delete(5000));
        if (!arg[0]) return msg.channel.send(nomsgEmbed).then(m => m.delete(5000));
        if (arg[0] === "embed") {
            const embed = new Discord.MessageEmbed()
                .setColor(`RANDOM`)
                .setDescription(arg.slice(1).join(" "))
            msg.channel.send(embed);
        } else msg.channel.send(arg.join(" "));
    }
}