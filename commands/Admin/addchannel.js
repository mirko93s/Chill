const Discord = require("discord.js");

module.exports = {
    name: "addchannel",
    aliases: ["newchannel", "createchannel"],
    category: "Admin",
    description: "Creates a new channel",
    usage: "<text-or-voice> <name>",
    permission: "MANAGE_CHANNELS",
    run: async (client, msg, arg) => {
        msg.delete();
        const nopermEmbed = new Discord.RichEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ You don't have permission to use this!`)
        const notypeEmbed = new Discord.RichEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Invalid type`)
        const nonameEmbed = new Discord.RichEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Please provide a valid name`)
        if (!msg.member.hasPermission("MANAGE_CHANNELS")) return msg.reply(nopermEmbed).then(msg => msg.delete(5000));
        let channeltype = arg[0];
        let channelname = arg[1];
        if(channeltype != "text" && channeltype != "voice") return msg.reply(notypeEmbed).then(msg => msg.delete(5000));
        if(!channelname) return msg.reply(nonameEmbed).then(msg => msg.delete(5000));
        if(channeltype == "text") msg.guild.createChannel(channelname, {type: 'text'});
        if(channeltype == "voice") msg.guild.createChannel(channelname, {type: 'voice'});
        const createdEmbed = new Discord.RichEmbed()
            .setColor(`GREEN`)
            .setTitle(`✅ Successfully created a new **${channeltype}** channel: **${channelname}**`)
        msg.channel.send(createdEmbed).then(msg => msg.delete(5000));
    }
}
