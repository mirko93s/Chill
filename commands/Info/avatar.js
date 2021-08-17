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
            .setTitle(`Avatar`)
            .setDescription(user.username)
            .setImage(user.displayAvatarURL())
        msg.channel.send({embeds:[avatarEmbed]});
    }
}
