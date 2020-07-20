const Discord = require("discord.js");

module.exports = {
    name: "ticket",
    category: "Moderation",
    description: "Create a ticket",
    usage: "ticket [close-delete]",
    run: async (client, msg, arg) => {
        msg.delete();

        const alreadyEmbed = new Discord.RichEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ You already have an opened ticket!`)
        const noticketchannelEmbed = new Discord.RichEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ You are not in a ticket channel!`)
        const nopermEmbed = new Discord.RichEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ You don't have permission to use this!`)
        
        if (!arg[0]) {
            let ticketalready = msg.guild.channels.find(ticketalready => ticketalready.name === `ticket-${msg.author.username}`);
            if (ticketalready) return msg.reply(alreadyEmbed).then(msg => msg.delete(5000));
    
            let channelname = `ticket-${msg.author.username}`
            let channelcategory = msg.guild.channels.find(channelcategory => channelcategory.name === 'tickets');
            let supportrole = msg.guild.roles.find(supportrole => supportrole.name === "Support");
    
            msg.guild.createChannel(channelname, {type: 'text'}).then((channel) => {
    
                channel.setParent(channelcategory);
                
                channel.overwritePermissions(msg.guild.id, {
                    VIEW_CHANNEL: false
                })
                
                channel.overwritePermissions(msg.author.id, {
                    VIEW_CHANNEL: true,
                    SEND_MESSAGES: true
                })

                channel.overwritePermissions(supportrole.id, {
                    VIEW_CHANNEL: true,
                    SEND_MESSAGES: true
                })
            });
            return;
        };

        if (arg [0] == "delete" && msg.channel.name.indexOf("❌ticket") == false) return msg.channel.delete();
        if (arg [0] == "delete" && msg.channel.name.indexOf("❌ticket") == true) return msg.channel.send(noticketchannelEmbed).then(msg => msg.delete(5000));

        if (arg[0] == "close" && msg.channel.name.indexOf("ticket") == false) {
            if (msg.member.roles.find(role => role.name === "Support") || msg.member.hasPermission("ADMINISTRATOR")) {
                let user = client.users.find(user => user.username == `${msg.channel.name.substring(7,msg.channel.length)}`);

                msg.channel.overwritePermissions(user.id, {
                    SEND_MESSAGES: false
                })
                
                const ticketclosed = new Discord.RichEmbed()
                .setColor(`GREEN`)
                .setTitle(`❌ The ticket has been closed.`)
                .setDescription(`<@${user.id}>`)

                let channelname = msg.channel.name;

                msg.channel.send(ticketclosed).then (() => msg.channel.setName(`❌${channelname}`));
            } else return msg.channel.send(nopermEmbed).then(msg => msg.delete(5000));
        } else return msg.channel.send(noticketchannelEmbed).then(msg => msg.delete(5000));

    }
}
