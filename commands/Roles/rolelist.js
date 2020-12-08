const Discord = require("discord.js");

module.exports = {
    name: "rolelist",
    category: "Roles",
    description: "Returns a list of server roles",
    usage: "rolelist\n**e.g.**\n\`rolelist\`\n> get a list of all the roles in this server",
    run: async (client, msg, arg) => {
        msg.delete();

        const role = msg.guild.roles.cache;
        const embed = new Discord.MessageEmbed()
            .setColor (`RANDOM`)
            .addField("Server Roles", role.map((e) => e).join("\n"))
        msg.channel.send(embed);
    }
}
