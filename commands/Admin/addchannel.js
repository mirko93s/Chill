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

        if (!msg.member.hasPermission("MANAGE_CHANNELS")) return msg.reply(nopermEmbed).then(msg => msg.delete({ timeout: 5000 }));
        let channeltype = arg[0];
        let channelname = arg[1];
        if (channelname.length > 100) return msg.channel.send(toolongEmbed).then(msg => msg.delete({ timeout: 5000 }));
        if (channeltype != "text" && channeltype != "voice") return msg.reply(notypeEmbed).then(msg => msg.delete({ timeout: 5000 }));
        if (!channelname) return msg.reply(nonameEmbed).then(msg => msg.delete({ timeout: 5000 }));
        if (channeltype == "text") msg.guild.channels.create(channelname, {type: 'text'});
        if (channeltype == "voice") msg.guild.channels.create(channelname, {type: 'voice'});
        const createdEmbed = new Discord.MessageEmbed()
            .setColor(`GREEN`)
            .setTitle(`✅ Successfully created a new **${channeltype}** channel: **${channelname}**`)
        msg.channel.send(createdEmbed).then(msg => msg.delete({ timeout: 5000 }));
    }
}
