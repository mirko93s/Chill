const Discord = require("discord.js");

module.exports = {
    name: "nickname",
    aliases: ["nick"],
    category: "Other",
    description: "Change a member's nickname",
    usage: "nickname <mention> <new nickname>\n**e.g.**\n\`nickname @mirko93s newnick\`\n> will nick the user mirko93s to \"newnick\"",
    permission: "MANAGE_NICKNAMES",
    run: async (client, msg, arg) => {

        const nopermEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ You don't have permission to use this!`)
        const nobotpermEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ I don't have permission to use this, please check my permissions`)
        const noargsEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Please mention someone and provide a new nickname`)
        const hierarchyEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ I can't change that member's nickname due to role hierarchy, I suppose`)
        const nomemberEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Couldn't find that member`)

        if (!msg.member.permissions.has("MANAGE_NICKNAMES")) return msg.channel.send({embeds:[nopermEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
        if (!msg.guild.members.cache.get(client.user.id).permissions.has('MANAGE_NICKNAMES')) return msg.channel.send({embeds:[nobotpermEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
        if (!arg[0] || !arg[1]) return msg.channel.send({embeds:[noargsEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
        const user = msg.mentions.members.first();
        if (!user) return msg.channel.send({embeds:[nomemberEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
        if (user.roles.highest.position > msg.guild.me.roles.highest.position || user.id === msg.guild.ownerID) return msg.channel.send({embeds:[hierarchyEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
        let newusername = arg.slice(1).join(' ')
        msg.guild.members.cache.get(user.user.id).setNickname(newusername);
        const embed = new Discord.MessageEmbed()
            .setColor(`RANDOM`)
            .addField("Username set successfully!", newusername + " is now the nickname for " + user.user.username + " :white_check_mark:");
        msg.channel.send({embeds:[embed]});
    }
}
