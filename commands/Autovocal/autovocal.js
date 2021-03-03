const Discord = require("discord.js");

module.exports = {
    name: "autovocal",
    aliases: ["av"],
    category: "Admin",
    description: "Creates auto-vocal channels",
    usage: "autovocal\n**e.g.**\n\`autovocal\`\n> Creates a new auto-vocal channel\n> When you join one of them it automaticcaly clones the channel and move you there, the new channel will be deleted when empty.",
    permission: "MANAGE_CHANNELS",
    run: async (client, msg, arg) => {
        
        const nopermEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ You don't have permission to use this!`)
        
        if (!msg.member.hasPermission("MANAGE_CHANNELS")) return msg.reply(nopermEmbed).then(msg => msg.delete({ timeout: 5000 }));
        
        msg.guild.channels.create(`auto-vocal`, {type: 'voice'}).then(channel => {
            client.settings.ensure(msg.guild.id, defaultSettings);
            client.settings.push(msg.guild.id, channel.id, "autovocalchannels");
        });
        
        const doneEmbed = new Discord.MessageEmbed()
            .setColor(`RANDOM`)
            .setTitle(`Auto-Vocal`)
            .setDescription(`The channel was successfully created.\nYou can now rename it, set the permissions, users limit, bitrate, etc...`)
        
        msg.channel.send(doneEmbed).then(msg => msg.delete({ timeout: 5000 }));
        
    }
}

const defaultSettings = {
    autovocalchannels: [],
    autovocalcloned: []
}