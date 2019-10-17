const Discord = require("discord.js");

module.exports = {
    name: "setup",
    category: "Admin",
    description: "Initial setup",
    run: async (client, msg, arg) => {
        msg.delete();
        if (!msg.member.hasPermission("ADMINISTRATOR")) return msg.reply("Sorry, you don't have permission to use this!");
        let bcchannel = msg.guild.channels.find(bcchannel => bcchannel.name === '🔴broadcast');
        let puchannel = msg.guild.channels.find(puchannel => puchannel.name === '🔨punishments');
        let reportchannel = msg.guild.channels.find(reportchannel => reportchannel.name === '🚨reports');
        let gachannel = msg.guild.channels.find(gachannel => gachannel.name === '🎉giveaway');
        let mutedrole = msg.guild.roles.find(mutedrole => mutedrole.name === "Muted");
        let djrole = msg.guild.roles.find(djrole => djrole.name === "DJ");
        if(!bcchannel) {
            msg.guild.createChannel("🔴broadcast", {type: 'text'})
            bcmsg = ("✅ channel created")
        } else bcmsg = ("❌ channel already exists");
        if(!puchannel) {
            msg.guild.createChannel("🔨punishments", {type: 'text'})
            pumsg = ("✅ channel created")
        } else pumsg = ("❌ channel already exists")
        if(!reportchannel) {
            msg.guild.createChannel("🚨reports", {type: 'text'})
            reportmsg = ("✅ channel created")
        } else reportmsg = ("❌ channel already exists")
        if(!gachannel) {
            msg.guild.createChannel("🎉giveaway", {type: 'text'})
            gamsg = ("✅ channel created")
        } else gamsg = ("❌ channel already exists")
        if (!mutedrole) {
            msg.guild.createRole({name: 'Muted',color: '525252'})
            mutedmsg = ("✅ role created")
        } else mutedmsg = ("❌ role already exists")
        if (!djrole) {
            msg.guild.createRole({name: 'DJ', color: 'D00091'})
            djmsg = ("✅ role created")
        } else djmsg = ("❌ role already exists")
        let setupembed = new Discord.RichEmbed()
        .setTitle("SETUP")
        .setDescription("COMPLETED")
        .setColor("#15f153")
        .setThumbnail(client.user.displayAvatarURL)
        .addField("🔴broadcast", bcmsg)
        .addField("🔨punishments", pumsg)
        .addField("🚨reports", reportmsg)
        .addField("🎉giveaway", gamsg)
        .addField("Muted", mutedmsg)
        .addField("DJ", djmsg)
        msg.channel.send(setupembed);
    }
}
