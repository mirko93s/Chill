const Discord = require("discord.js");

module.exports = {
    name: "roleinfo",
    aliases: ["rinfo"],
    category: "Roles",
    description: "Returns role info",
    usage: "roleinfo <role name>\n**e.g.**\n\`roleinfo DJ\`\n> will return few info about the \"DJ\" role\n> Keep in mind, role names are case-sensitive",
    run: async (client, msg, arg) => {
        msg.delete();

        const noroleEmbed = new Discord.RichEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Role not found`)

        let roletocheck = arg.join(" ")
        let role = client.guilds.get(msg.guild.id).roles.find('name', roletocheck);
        if (!role) return msg.channel.send(noroleEmbed).then(msg => msg.delete(5000));
            const embed = new Discord.RichEmbed()
            .setColor(0x00A2E8)
            .addField('Role name', `${role.name}`, true)
            .addField('Role ID', `${role.id}`, true)
            .addField('Created At', role.createdAt.toDateString())
            .addField("Mentionable: ", role.mentionable ? 'Yes' : 'No')
            msg.channel.send(embed);
    }
}
