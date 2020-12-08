const Discord = require("discord.js");

module.exports = {
    name: "avatar",
    aliases: ["av"],
    category: "Info",
    description: "Display user's avatar",
    usage: "avatar [mention]\n**e.g.**\n\`avatar @mirko93s\`\n> will return mirko93s' avatar\n\`avatar\`\n> will return your avatar",
    run: async (client, msg, arg) => {
        msg.delete();

        const nomentionEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Please mention a valid user of the server or leave it blank`)

        let user = arg[0];
        if (msg.mentions.users.size) {user = msg.mentions.users.first();}
        else user = msg.author
        if (arg[0] && !msg.mentions.users.first()) msg.channel.send(nomentionEmbed).then(msg => {msg.delete({ timeout: 5000 })});
        else {
            let avatarEmbed = new Discord.MessageEmbed()
                .setColor(`RANDOM`)
                .setTitle(`Avatar`)
                .setDescription(user.username)
                .setImage(user.displayAvatarURL())
            msg.channel.send(avatarEmbed);
        }
    }
}
