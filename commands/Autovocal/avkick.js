const Discord = require("discord.js");

module.exports = {
    name: "autovocalkick",
    aliases: ["avkick"],
    category: "Admin",
    description: "Kick someone out of your Auto-Vocal channel",
    usage: "autovocalkick <mention>\n**e.g.**\n\`autovocalkick @mirko93s\`\n> Kick someone out of your auto-vocal channel and remove the permission to join",
    permission: "CREATOR OF THE CHANNEL",
    run: async (client, msg, arg) => {

        const nocreatorEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ You don't have permission to use this!\nOnly the creator of this channel can kick people.`)
        const noavchannelEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ You are not in an Auto-Vocal channel.`)
        const nomentionEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Please mention a valid user of this server.`)
        const alreadyEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ That person is not whitelisted.`)
        const notlockedEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ This Auto-Vocal channel is not locked.`)

        let temprole = msg.guild.roles.cache.find(role => role.name === (`av-${msg.member.voice.channelID}`));
        if (!temprole) return msg.channel.send(notlockedEmbed).then(msg => msg.delete({ timeout: 5000 }));

        if (client.settings.includes(msg.guild.id, msg.member.voice.channelID, "autovocalcloned")) {
            if (msg.member.voice.channel.name.includes(msg.author.username)) {
                let invited = msg.guild.member(msg.mentions.users.first());
                if (!invited) return msg.channel.send(nomentionEmbed).then(msg => msg.delete({ timeout: 5000 }));
                if (!invited.roles.cache.some(role => role.id === temprole.id)) return msg.channel.send(alreadyEmbed).then(msg => msg.delete({ timeout: 5000 }));
                invited.roles.remove(temprole.id);
                invited.voice.kick();
                const kickedEmbed = new Discord.MessageEmbed()
                    .setColor('RANDOM')
                    .setDescription(`${invited} has been kicked out of your Auto-Vocal channel`)
                msg.channel.send(kickedEmbed).then(msg => msg.delete({ timeout: 5000 }));
            } else return msg.channel.send(nocreatorEmbed).then(msg => msg.delete({ timeout: 5000 }));
        }else return msg.channel.send(noavchannelEmbed).then(msg => msg.delete({ timeout: 5000 }));
    }
}
