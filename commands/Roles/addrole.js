module.exports = {
    name: "addrole",
    aliases: ["grant"],
    category: "Roles",
    description: "Grant a role to users",
    usage: "<user-mention> <role>",
    run: async (client, msg, arg) => {
        msg.delete();
        if (!msg.member.hasPermission("MANAGE_ROLES")) return msg.reply("Sorry, you don't have permission to use this!");
        let rMember = msg.guild.member(msg.mentions.users.first()) || msg.guild.members.get(arg[0]);
        let role = arg.join(" ").slice(22);
        if (!rMember || !role) return msg.reply("Please mention a valid member of this server and specify a role.");
        let gRole = msg.guild.roles.find(grole => grole.name === role);
        
        if (!gRole) return msg.reply("Couldn't find that role.");
        if (rMember.roles.has(gRole.id)) return msg.reply("They already have that role.");
        await (rMember.addRole(gRole.id));
        msg.channel.send(`Congrats to <@${rMember.id}>, they have been given the role ${gRole.name}.`)
    }
}
