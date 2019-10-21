const Discord = require("discord.js");

module.exports = {
    name: "avatar",
    aliases: ["av"],
    category: "Fun",
    description: "Display user's avatar",
    usage: "[user-mention]",
    run: async (client, msg, arg) => {
        msg.delete();

        const nomentionEmbed = new Discord.RichEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Please mention a valid user of the server or leave it blank`)

        let user = arg[0];
        if (msg.mentions.users.size) {user = msg.mentions.users.first();}
        else user = msg.author
        if (arg[0] && !msg.mentions.users.first()) msg.channel.send(nomentionEmbed).then(msg => {msg.delete(5000)});
        else {
            let avatarEmbed = new Discord.RichEmbed()
                .setColor(`RANDOM`)
                .setTitle(`Avatar`)
                .setDescription(user.username)
                .setImage(user.displayAvatarURL)
            msg.channel.send(avatarEmbed);
        }
    }
}
