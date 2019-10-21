module.exports = {
    name: "addrole",
    aliases: ["grant"],
    category: "Roles",
    description: "Grant a role to users",
    usage: "<user-mention> <role>",
    permission: "MANAGE_ROLES",
    run: async (client, msg, arg) => {
        msg.delete();

        const nopermEmbed = new Discord.RichEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ You don't have permission to use this!`)
        const noargsEmbed = new Discord.RichEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Please mention a valid user of this server and provide a role`)
        const noroleEmbed = new Discord.RichEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Couldn't find that role`)

        if (!msg.member.hasPermission("MANAGE_ROLES")) return msg.channel.send(nopermEmbed).then(msg => msg.delete(5000));
        let rMember = msg.guild.member(msg.mentions.users.first()) || msg.guild.members.get(arg[0]);
        let role = arg.join(" ").slice(22);
        if (!rMember || !role) return msg.channel.send(noargsEmbed).then(msg => msg.delete(5000));
        let gRole = msg.guild.roles.find(grole => grole.name === role);
        if (!gRole) return msg.channel.send(noroleEmbed).then(msg => msg.delete(5000));

        const alreadyEmbed = new Discord.RichEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ ${rMember} already has that role`)

        if (rMember.roles.has(gRole.id)) return msg.channel.send(alreadyEmbed).then(msg => msg.delete(5000));
        await (rMember.addRole(gRole.id));

        const doneEmbed = new Discord.RichEmbed()
            .setColor(`GREEN`)
            .setTitle(`✅ **${grole.name}** has been given to <@${rMember.id}`)

        msg.channel.send(doneEmbed);
    }
}
