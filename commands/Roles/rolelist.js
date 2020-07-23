const Discord = require("discord.js");

module.exports = {
    name: "rolelist",
    category: "Roles",
    description: "Returns a list of server roles",
    usage: "rolelist\n**e.g.**\n\`rolelist\`\n> get a list of all the roles in this server",
    run: async (client, msg, arg) => {
        const role = msg.guild.roles;
        const embed = new Discord.RichEmbed()
            .setColor (`RANDOM`)
            .addField("Server Roles", role.map((e) => e).join("\n"))
        msg.channel.send(embed);
    }
}
