const Discord = require("discord.js");

module.exports = {
    name: "avatar",
    category: "Info",
    description: "Display user's avatar",
    usage: "avatar [mention]\n**e.g.**\n\`avatar @mirko93s\`\n> will return mirko93s' avatar\n\`avatar\`\n> will return your avatar",
    run: async (client, msg, arg) => {

        let user = msg.mentions.users.first();
        if (!msg.mentions.users.size) user = msg.author;

        const avatarEmbed = new Discord.MessageEmbed()
            .setColor(`RANDOM`)
            .setTitle(`${user.username}'s avatar`)
            .setImage(user.displayAvatarURL({size: 4096, dynamic: true}))
            .setURL(user.displayAvatarURL({size: 4096, dynamic: true}))
        msg.channel.send({embeds:[avatarEmbed]});
    }
}
