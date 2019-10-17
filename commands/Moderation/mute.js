module.exports = {
    name: "mute",
    category: "Moderation",
    description: "Mute someone",
    usage: "<mention> [reason]",
    run: async (client, msg, arg) => {
        msg.delete();
        if (!msg.member.hasPermission("MANAGE_ROLES")) return msg.reply("Sorry, you don't have permission to use this!");
        let rMember = msg.guild.member(msg.mentions.users.first()) || msg.guild.members.get(arg[0]);
        if (!rMember) return msg.reply("Please mention a valid member of this server to mute.");
        let gRole = msg.guild.roles.find(grole => grole.name === "Muted");
        if (!gRole) return msg.reply("Couldn't find Muted role");
        if (rMember.roles.has(gRole.id)) return msg.reply("That user is already muted.");
        let reason = arg.slice(1).join(' ');
        if(!reason) reason = "No reason provided";
        let puchannel = msg.guild.channels.find(puchannel => puchannel.name === "🔨punishments");
        if(!puchannel) return msg.channel.send("Can't find 🔨punishments channel.");
        await (rMember.addRole(gRole.id));
        puchannel.send(`<@${rMember.id}> has been muted by ${msg.author.username} because: ${reason}`);
    }
}
