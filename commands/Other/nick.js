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

        if (!msg.member.hasPermission("MANAGE_NICKNAMES")) return msg.channel.send(nopermEmbed).then(msg => msg.delete(5000));
        if (!msg.guild.member(client.user).hasPermission('MANAGE_NICKNAMES')) return msg.channel.send(nobotpermEmbed).then(msg => msg.delete(5000));
        if (!msg.mentions.users.size < 1) return msg.channel.send(noargsEmbed).then(msg => msg.delete(5000));
        let user = msg.guild.member(msg.mentions.users.first());
        if (user.highestRole.position >= msg.member.highestRole.position ) return msg.channel.send(hierarchyEmbed).then(msg => msg.delete(5000));
        let newusername = arg.slice(1).join(' ')
        if (newusername.length < 1) return msg.channel.send(noargsEmbed).then(msg => msg.delete(5000));
        msg.guild.members.get(user.user.id).setNickname(newusername);
        const embed = new Discord.RichEmbed()
            .setColor(`RANDOM`)
            .addField("Username set successfully!", newusername + " is now the nickname for " + user.user.username + " :white_check_mark:");
        msg.channel.send({embed})
    }
}
