const Discord = require("discord.js");

module.exports = {
    name: "addrole",
    aliases: ["grant"],
    category: "Roles",
    description: "Grant a role to users",
    usage: "addrole <user-mention> <role>\n**e.g.**\n\`addrole @mirko93s DJ\`\n> will give the \"DJ\" role to the user mirko93s",
    permission: "MANAGE_ROLES",
    run: async (client, msg, arg) => {

        const nopermEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ You don't have permission to use this!`)
        const noargsEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Please mention a valid user of this server and provide a role`)
        const noroleEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Couldn't find that role`)  

        if (!msg.member.permissions.has("MANAGE_ROLES")) return msg.channel.send({embeds:[nopermEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
        let rMember = msg.mentions.members.first() || msg.guild.members.cache.get(arg[0]);
        let role = arg.slice(1).join(" ")
        if (!rMember || !role) return msg.channel.send({embeds:[noargsEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
        let gRole = msg.guild.roles.cache.find(grole => grole.name === (role));
        if (!gRole) return msg.channel.send({embeds:[noroleEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
        const alreadyEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setDescription(`⛔ ${rMember} already has that role`)
        if (rMember.roles.cache.some(r => r.id === gRole.id)) return msg.channel.send({embeds:[alreadyEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
        const hierarchyEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setDescription(`⛔ ${rMember} I can't give the role ${gRole.name} due to roles hierarchy.`)
        if (msg.guild.me.roles.highest.position < gRole.rawPosition) return msg.channel.send({embeds:[hierarchyEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
        await (rMember.roles.add(gRole.id));

        const doneEmbed = new Discord.MessageEmbed()
            .setColor(`GREEN`)
            .setDescription(`✅ **${gRole.name}** has been given to ${rMember}`)

        msg.channel.send({embeds:[doneEmbed]});
    }
}
