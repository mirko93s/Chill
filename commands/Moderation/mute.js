const Discord = require("discord.js");
const ms = require('ms');
const { promptMessage } = require("../../functions.js");

module.exports = {
    name: "mute",
    category: "Moderation",
    description: "Mute a member",
    usage: "mute <mention> <duration> <reason>\n**e.g.**\n\`mute @mirko93s 2d reason\`\n> will mute mirko93s for 2 days\n> The mute will be logged in the punishments channel",
    permission: "MANAGE_ROLES",
    run: async (client, msg, arg) => {
        if (client.settings.get(msg.guild.id, "autodeletecmds") === "true") msg.delete();

        const nochannelEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Punishments channel not found`)
        const nopermEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ You don't have permission to use this!`)
        const nobotpermEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ I don't have permission to use this, please check my permissions`)
        const noargsEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Please mention a valid user of this server and provide a reason`)
        const nomemberEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Couldn't find that member`)
        const noyourselfEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ You can't mute yourself`)
        const noroleEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Muted role not found`)
        const alreadyEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ That person is already muted`)
        const canceledEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Mute canceled`)
        const invalidtimeEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Invalid time entered!`)

        let mutedrole = msg.guild.roles.cache.find(mutedrole => mutedrole.name === (client.settings.get(msg.guild.id, "mutedrole")));
        let puchannel = msg.guild.channels.cache.find(puchannel => puchannel.name === (client.settings.get(msg.guild.id, "puchannel")));

        if (!msg.member.hasPermission("MANAGE_ROLES")) return msg.channel.send(nopermEmbed).then(msg => msg.delete({ timeout: 5000 }));
        if (!msg.guild.me.hasPermission("MANAGE_ROLES")) return msg.channel.send(nobotpermEmbed).then(msg => msg.delete({ timeout: 5000 }));
        if (!puchannel) return msg.channel.send (nochannelEmbed).then(msg => msg.delete({ timeout: 5000 }));
        if (!mutedrole) return msg.channel.send(noroleEmbed).then(msg => msg.delete({ timeout: 5000 }));
        if (!arg[0] || !arg[1]) return msg.channel.send(noargsEmbed).then(m => m.delete({timeout:5000}));
        
        const toMute = msg.mentions.members.first();

        const time = arg[1];
        if(!time.match(/[1-60][s,m,h,d,w]/g)) return msg.channel.send(invalidtimeEmbed).then(msg => msg.delete({ timeout: 5000 }));
        const reason = arg.slice(2).join("");

        if (toMute.roles.cache.some(r => r.id === mutedrole.id)) return msg.channel.send(alreadyEmbed).then(msg => msg.delete({ timeout: 5000 }));
        if (!toMute) return msg.channel(nomemberEmbed).then(msg => msg.delete({ timeout: 5000 }));
        if (toMute.id === msg.author.id) return msg.channel.send(noyourselfEmbed).then(msg => msg.delete({ timeout: 5000 }));

        const muteEmbed = new Discord.MessageEmbed()
            .setColor(`GOLD`)
            .setThumbnail(toMute.user.displayAvatarURL())
            .setTimestamp()
            .setTitle(`MUTE`)
            .setDescription(`
            **Member:** ${toMute}
            \n**By:** ${msg.member}
            \n**Time:** ${time}
            \n**Reason:** ${reason}
            `);

        const muteexpiredEmbed = new Discord.MessageEmbed()
            .setColor(`DARK_AQUA`)
            .setThumbnail(toMute.user.displayAvatarURL())
            .setTimestamp()
            .setTitle(`MUTE EXPIRED`)
            .setDescription(`**Member:** ${toMute}`);

        const promptEmbed = new Discord.MessageEmbed()
            .setColor("GREEN")
            .setAuthor(`This verification becomes invalid after 30s.`)
            .setDescription(`Do you want to mute ${toMute}?`)

        // Send the msg
        await msg.channel.send(promptEmbed).then(async promptmsg => {
            // Await the reactions and the reactioncollector
            const emoji = await promptMessage(promptmsg, msg.author, 30, ["✅", "❌"]);

            // Verification stuffs
            if (emoji === "✅") {
                promptmsg.delete();

                toMute.roles.add(mutedrole.id)
                    .catch(err => {
                        const errorEmbed = new Discord.MessageEmbed()
                            .setColor(`RED`)
                            .setTitle(`⛔ Error: **${err}**`)
                        if (err) return msg.channel.send(errorEmbed).then(msg => msg.delete({ timeout: 5000 }));
                    });

                puchannel.send(muteEmbed);

                setTimeout(() => {
                    toMute.roles.remove(mutedrole.id);
                    puchannel.send(muteexpiredEmbed);
                }, ms(time));
            }
            else if (emoji === "❌") {
                promptmsg.delete();
                msg.channel.send(canceledEmbed).then(msg => msg.delete({ timeout: 5000 }));
            }
        });
    }
};
