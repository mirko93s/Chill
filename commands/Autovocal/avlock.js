const Discord = require("discord.js");

module.exports = {
    name: "autovocallock",
    aliases: ["avlock"],
    category: "Admin",
    description: "Lock the Auto-Vocal channel you are in",
    usage: "autovocallock\n**e.g.**\n\`autovocallock\`\n> Lock an auto-vocal channel\n> You can lock a channel so you can later invite and select who can join it",
    permission: "CREATOR OF THE CHANNEL",
    run: async (client, msg, arg) => {
        
        const nocreatorEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ You don't have permission to use this!\nOnly the creator of this channel can lock it.`)
        const noavchannelEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ You are not in an Auto-Vocal channel.`)
        const alreadylockedEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ This Auto-Vocal channel is already locked.`)

        let temprole = msg.guild.roles.cache.find(role => role.name === (`av-${msg.member.voice.channelID}`));
        if (temprole) return msg.channel.send({embeds:[alreadylockedEmbed]}).then(msg => msg.delete({ timeout: 5000 }));

        if (client.settings.includes(msg.guild.id, msg.member.voice.channelID, "autovocalcloned")) {
            if (msg.member.voice.channel.name.includes(msg.author.username)) {
                msg.guild.roles.create({ data: {name: `av-${msg.member.voice.channelID}`,permissions: [],color: '000000'}}).then(temprole => {

                    msg.guild.channels.cache.get(msg.member.voice.channelID).members.forEach((member) => {
                        member.roles.add(temprole.id);
                    })
    
                    msg.member.voice.channel.permissionOverwrites.edit(msg.guild.roles.everyone.id, {
                        VIEW_CHANNEL: false,
                        SPEAK: false,
                        CONNECT: false
                    });
                    msg.member.voice.channel.permissionOverwrites.edit(temprole.id, {
                        VIEW_CHANNEL: true,
                        SPEAK: true,
                        STREAM: true,
                        CONNECT: true
                    });
                });
                const lockedEmbed = new Discord.MessageEmbed()
                    .setColor('RANDOM')
                    .setTitle('🔒Channel Locked')
                    .setDescription('You can now invite other users to join this vocal chat doing `.autovocalinvite @user`.')
                msg.channel.send({embeds:[lockedEmbed]}).then(msg =>setTimeout(() => msg.delete(), 10000));
            } else return msg.channel.send({embeds:[nocreatorEmbed]}).then(msg => msg.delete({ timeout: 5000 }));
        } else return msg.channel.send({embeds:[noavchannelEmbed]}).then(msg => msg.delete({ timeout: 5000 }));
    }
}
