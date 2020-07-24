const Discord = require("discord.js");

module.exports = {
    name: "nickname",
    aliases: ["nick"],
    category: "Other",
    description: "Change a member's nickname",
    usage: "nickname <mention> <new nickname>\n**e.g.**\n\`nickname @mirko93s newnick\`\n> will nick the user mirko93s to \"newnick\"",
    permission: "MANAGE_NICKNAMES",
    run: async (client, msg, arg) => {
        msg.delete();

        const nopermEmbed = new Discord.RichEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ You don't have permission to use this!`)
        const nobotpermEmbed = new Discord.RichEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ I don't have permission to use this, please check my permissions`)
        const noargsEmbed = new Discord.RichEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Please mention someone and provide a new nickname`)
        const hierarchyEmbed = new Discord.RichEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ I can't change that member's nickname due to role hierarchy, I suppose`)
        const nomemberEmbed = new Discord.RichEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Couldn't find that member`)

        if (!msg.member.hasPermission("MANAGE_NICKNAMES")) return msg.channel.send(nopermEmbed).then(msg => msg.delete(5000));
        if (!msg.guild.member(client.user).hasPermission('MANAGE_NICKNAMES')) return msg.channel.send(nobotpermEmbed).then(msg => msg.delete(5000));
        if (!arg[0] || !arg[1]) return msg.channel.send(noargsEmbed).then(m => m.delete(5000));
        const user = msg.mentions.members.first();
        if (!user) return msg.channel.send(nomemberEmbed).then(m => m.delete(5000));
        if (user.highestRole.position >= msg.guild.me.highestRole.position || user.id === msg.guild.ownerID) return msg.channel.send(hierarchyEmbed).then(msg => msg.delete(5000));
        let newusername = arg.slice(1).join(' ')
        msg.guild.members.get(user.user.id).setNickname(newusername);
        const embed = new Discord.RichEmbed()
            .setColor(`RANDOM`)
            .addField("Username set successfully!", newusername + " is now the nickname for " + user.user.username + " :white_check_mark:");
        msg.channel.send({embed})
    }
}
