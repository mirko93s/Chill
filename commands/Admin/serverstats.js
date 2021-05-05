const Discord = require("discord.js");
const { fancyNumber } = require("../../functions.js");

module.exports = {
    name: "serverstats",
    aliases: ["ss"],
    category: "Admin",
    description: "Display some server stats using locked channels",
    usage: "serverstats\n**e.g.**\n> \`serverstats\`\n> It will create a locked channel which will show track the user counter of your server.\n> Automatically updated every 15 minutes.",
    permission: "ADMINISTRATOR",
    run: async (client, msg, arg) => {

        const nopermEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ You don't have permission to use this!`)

        if (!msg.member.hasPermission("ADMINISTRATOR")) return msg.reply(nopermEmbed).then(msg => msg.delete({ timeout: 5000 }));
 
        if (client.settings.has(msg.guild.id, "usercounter")) {
            const channel = msg.guild.channels.cache.find(c => c.id === (client.settings.get(msg.guild.id, "usercounter")));
            if (channel) channel.delete();
            client.settings.delete(msg.guild.id, "usercounter");
            const disabledEmbed = new Discord.MessageEmbed()
                .setColor(`RED`)
                .setTitle(`Server Stats`)
                .setDescription(`**Disabled**`)
            return msg.channel.send(disabledEmbed).then(msg => msg.delete({ timeout: 5000 }));
        } else {
            var memberCount = msg.guild.members.cache.filter(member => !member.user.bot).size; //filtering bots
            memberCount = fancyNumber(memberCount);
            msg.guild.channels.create(`📊Users: ${memberCount}`, {
                type: 'voice', 
                permissionOverwrites: [
                    {id: msg.guild.roles.everyone.id, 
                    deny: [`CONNECT`],
                    allow: [`VIEW_CHANNEL`]
                    }
                ]
            })
            .then(c => {client.settings.set(msg.guild.id, c.id, "usercounter")});
            const enabledEmbed = new Discord.MessageEmbed()
                .setColor(`GREEN`)
                .setTitle(`Server Stats`)
                .setDescription(`**Enabled**`)
            return msg.channel.send(enabledEmbed).then(msg => msg.delete({ timeout: 5000 }));
        }
        
    }
}
