const Discord = require("discord.js");

module.exports = {
    name: "autovocalinvite",
    aliases: ["avinvite"],
    category: "Admin",
    description: "Invite and allow users to join your Auto-Vocal channel",
    usage: "autovocalinvite <mention>\n**e.g.**\n\`autovocalinvite @mirko93s\`\n> Invite and whitelist someone in your auto-vocal channel",
    permission: "ANYONE IN THE VOCAL CHANNEL",
    run: async (client, msg, arg) => {

        const noavchannelEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ You are not in an Auto-Vocal channel.`)
        const nomentionEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Please mention a valid user of this server.`)
        const alreadyEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ That person is already whitelisted.`)
        const notlockedEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ This Auto-Vocal channel is not locked.`)

        let temprole = msg.guild.roles.cache.find(role => role.name === (`av-${msg.member.voice.channelID}`));
        if (!temprole) return msg.channel.send(notlockedEmbed).then(msg => msg.delete({ timeout: 5000 }));

        if (client.settings.includes(msg.guild.id, msg.member.voice.channelID, "autovocalcloned")) {
            if (msg.member.roles.cache.find(temprole => temprole.name === ("av-"+msg.member.voice.channelID))) {
                let invited = msg.guild.member(msg.mentions.users.first());
                if (!invited) return msg.channel.send(nomentionEmbed).then(msg => msg.delete({ timeout: 5000 }));
                if (invited.roles.cache.some(role => role.id === temprole.id)) return msg.channel.send(alreadyEmbed).then(msg => msg.delete({ timeout: 5000 }));
                invited.roles.add(temprole.id);
                const invitedEmbed = new Discord.MessageEmbed()
                    .setColor('RANDOM')
                    .setDescription(`${invited} has been whitelisted in your Auto-Vocal channel`)
                msg.channel.send(invitedEmbed).then(msg => msg.delete({ timeout: 5000 }));
            } else return msg.channel.send(nopermEmbed).then(msg => msg.delete({ timeout: 5000 }));
        } else return msg.channel.send(noavchannelEmbed).then(msg => msg.delete({ timeout: 5000 }));
    }
}
