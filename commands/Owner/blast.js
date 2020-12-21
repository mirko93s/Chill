const Discord = require("discord.js");
const config = require('../../config.json');

module.exports = {
    name: "blast",
    category: "Owner",
    description: "DM to all server owners",
    usage: "blast <message>\n**e.g.**\n\`blast new update coming\`\n> Sends a DM to all guild owners.\n> Useful to update server owners about critical and important changes in the bot.",
    permission: "DEV_ONLY",
    run: async (client, msg, arg) => {
        if (client.settings.get(msg.guild.id, "autodeletecmds") === "true") msg.delete();

        const nopermEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ You don't have permission to use this!`)
        const nomsgEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Please provide a valid message`)

        if (msg.author.id !== config.bot_owner) return msg.channel.send(nopermEmbed).then(msg => msg.delete({ timeout: 5000 }));
        const text = arg.join(" ");
        if (!text) return msg.channel.send(nomsgEmbed).then(msg => msg.delete({ timeout: 5000 }));

        const blastEmbed = new Discord.MessageEmbed()
            .setColor(`PURPLE`)
            .setTitle(`📢 **BOT UPDATE**`)
            .setDescription(`**${text}**`)
            .setFooter(`by ${msg.author.username}`,msg.author.displayAvatarURL())

        var owners = [];
        client.guilds.cache.forEach(guild => owners.push(guild.ownerID));
        owners = owners.filter(function(elem, index, self) {return index === self.indexOf(elem);})
        owners.forEach(owner => client.users.cache.get(owner).send(blastEmbed));
    }
}
