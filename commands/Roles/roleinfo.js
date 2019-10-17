const Discord = require("discord.js");

module.exports = {
    name: "roleinfo",
    aliases: ["rinfo"],
    category: "Roles",
    description: "Returns role info",
    usage: "<role name>",
    run: async (client, msg, arg) => {
        msg.delete();
        let roletocheck = arg.join(" ")
        let role = client.guilds.get(msg.guild.id).roles.find('name', roletocheck);
        if (!role) return msg.channel.send("Role wasnt found in the server.")
            const embed = new Discord.RichEmbed()
            .setColor(0x00A2E8)
            .addField('Role name', `${role.name}`, true)
            .addField('Role ID', `${role.id}`, true)
            .addField('Created At', role.createdAt.toDateString())
            .addField("Mentionable: ", role.mentionable ? 'Yes' : 'No')
            msg.channel.send({embed}) 
    }
}
