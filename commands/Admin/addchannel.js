const Discord = require("discord.js");

module.exports = {
    name: "addchannel",
    aliases: ["newchannel", "createchannel"],
    category: "Admin",
    description: "Creates a new channel",
    usage: "addchannel <text | voice> <name>\n**e.g.**\n\`addchannel text textchannelname\`\n> will create a text channel named \"textchannelname\"\n\`addchannel voice voicechannelname\`\n> will create a voice channel named voicechannelname ",
    permission: "MANAGE_CHANNELS",
    run: async (client, msg, arg) => {
        
        const nopermEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ You don't have permission to use this!`)
        const notypeEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Invalid type`)
        const nonameEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Please provide a valid name`)
        const toolongEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Channel name can't be longer than 100 characters.`)
        const noargsembed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ No args provided.`)

        if (!msg.member.permissions.has("MANAGE_CHANNELS")) return msg.channel.send({embeds:[nopermEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
        let channeltype = arg[0];
        let channelname = arg[1];
        if (!arg[0] || !arg[1]) return msg.channel.send({embeds:[noargsembed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
        if (channelname.length > 100) return msg.channel.send({embeds:[toolongEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
        if (channeltype != "text" && channeltype != "voice") return msg.channel.send({embeds:[notypeEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
        if (!channelname) return msg.channel.send({embeds:[nonameEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
        if (channeltype == "text") msg.guild.channels.create(channelname, {type: 'GUILD_TEXT'});
        if (channeltype == "voice") msg.guild.channels.create(channelname, {type: 'GUILD_VOICE'});
        const createdEmbed = new Discord.MessageEmbed()
            .setColor(`GREEN`)
            .setTitle(`✅ Successfully created a new **${channeltype}** channel: **${channelname}**`)
        msg.channel.send({embeds:[createdEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
    }
}
