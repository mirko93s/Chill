const Discord = require("discord.js");

module.exports = {
    name: "ticket",
    category: "Moderation",
    description: "Create a ticket",
    usage: "ticket [close-delete]\n**e.g.**\n\`ticket\`\n> will create a ticket\n> It will create a new private channel\n> Only you and the @Support team can view and send messages in that channel\n\`ticket close\`\n> @Support can use this command to lock the channel\n> You won't be able to send messages anymore but you can still read them\n\`ticket delete\`\n> @Support can use this command to simply delete the channel after some time",
    permission: "@everyone | @Support",
    run: async (client, msg, arg) => {

        const alreadyEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ You already have an opened ticket!`)
        const noticketchannelEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ You are not in a ticket channel!`)
        const nopermEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ You don't have permission to use this!`)
        const noticketcategoryEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Ticket Channel Category doesn't exists!"`)
        
        if (!arg[0]) {
            let ticketalready = msg.guild.channels.cache.find(ticketalready => ticketalready.name === `ticket-${msg.author.username}`);
            if (ticketalready) return msg.channel.send({embeds:[alreadyEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
    
            let channelname = `ticket-${msg.author.username}`
            let channelcategory = msg.guild.channels.cache.find(channelcategory => channelcategory.id === (client.settings.get(msg.guild.id, "ticketcategory")));
            if(!channelcategory) return msg.channel.send({embeds:[noticketcategoryEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
            let supportrole = msg.guild.roles.cache.find(supportrole => supportrole.id === (client.settings.get(msg.guild.id, "supportrole")));
    
            msg.guild.channels.create(channelname, {type: 'GUILD_TEXT'}).then(channel => {
    
                channel.setParent(channelcategory);
                
                channel.permissionOverwrites.create(msg.guild.roles.everyone.id , {
                    VIEW_CHANNEL: false
                });          
                channel.permissionOverwrites.create(msg.author.id, {
                    VIEW_CHANNEL: true,
                    SEND_MESSAGES: true
                });
                channel.permissionOverwrites.create(supportrole.id, {
                    VIEW_CHANNEL: true,
                    SEND_MESSAGES: true
                });

                const ticketEmbed = new Discord.MessageEmbed()
                    .setColor('RANDOM')
                    .setTitle('🎟️ TICKET 🎟️')
                    .setDescription(`**${msg.member.user} someone will be with you shortly.**`)

                channel.send({embeds:[ticketEmbed]});
            });
            return;
        };

        if (arg [0] == "delete" && msg.channel.name.includes("ticket") == true) {
            if (msg.member.roles.cache.find(supportrole => supportrole.id === (client.settings.get(msg.guild.id, "supportrole"))) || msg.member.permissions.has("ADMINISTRATOR")) return msg.channel.delete();
            else return msg.channel.send({embeds:[nopermEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
        }

        if (arg[0] == "close" && msg.channel.name.indexOf("ticket") == false) {
            if (msg.member.roles.cache.find(supportrole => supportrole.id === (client.settings.get(msg.guild.id, "supportrole"))) || msg.member.permissions.has("ADMINISTRATOR")) {
                let user = client.users.cache.find(user => user.username == `${msg.channel.name.substring(7,msg.channel.length)}`);

                msg.channel.permissionOverwrites.create(user.id, {
                    SEND_MESSAGES: false
                })
                
                const ticketclosed = new Discord.MessageEmbed()
                    .setColor(`GREEN`)
                    .setTitle(`❌ The ticket has been closed.`)
                    .setDescription(`<@${user.id}>`)

                let channelname = msg.channel.name;

                msg.channel.send({embeds:[ticketclosed]}).then (() => msg.channel.setName(`❌${channelname}`));
            } else return msg.channel.send({embeds:[nopermEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
        } else return msg.channel.send({embeds:[noticketchannelEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));

    }
}
