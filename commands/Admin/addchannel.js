module.exports = {
    name: "addchannel",
    aliases: ["newchannel", "createchannel"],
    category: "Admin",
    description: "Creates a new channel",
    usage: "<text-or-voice> <name>",
    run: async (client, msg, arg) => {
        msg.delete();
        if (!msg.member.hasPermission("MANAGE_CHANNELS")) return msg.reply("Sorry, you don't have permission to use this!")
        let channeltype = arg[0];
        let channelname = arg[1];
        if(!channeltype || !channelname) return msg.reply("Please provide a valid type and name to create a new channel")
        if(channeltype == "text") return msg.guild.createChannel(channelname, {type: 'text'})
        if(channeltype == "voice") return msg.guild.createChannel(channelname, {type: 'voice'})
        else return msg.reply("invalid type")
        msg.channel.send(`Successfully created a new channel: ${channelname}`)
    }
}
