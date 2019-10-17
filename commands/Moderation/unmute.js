module.exports = {
    name: "unmute",
    category: "Moderation",
    description: "Unmute someone",
    usage: "<mention>",
    run: async (client, msg, arg) => {
        msg.delete();
        if (!msg.member.hasPermission("MANAGE_ROLES")) return msg.reply("Sorry, you don't have permission to use this!");
        let rMember = msg.guild.member(msg.mentions.users.first()) || msg.guild.members.get(arg[0]);
        if (!rMember) return msg.reply("Please mention a valid member of this server to mute.");
        let gRole = msg.guild.roles.find(grole => grole.name === "Muted");
        if (!gRole) return msg.reply("Couldn't find Muted role");
        if (!rMember.roles.has(gRole.id)) return msg.reply("That user isn't muted.");
        let puchannel = msg.guild.channels.find(puchannel => puchannel.name === "🔨punishments");
        if(!puchannel) return msg.channel.send("Can't find 🔨punishments channel.");
        await (rMember.removeRole(gRole.id));
        puchannel.send(`<@${rMember.id}> is no longer muted.`);
    }
}
