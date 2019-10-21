const Discord = require("discord.js");
const { stripIndents } = require("common-tags");
const { promptMessage } = require("../../functions.js");

module.exports = {
    name: "unmute",
    category: "Moderation",
    description: "unmutes the member",
    usage: "<mention> <reason>",
    permission: "MANAGE_ROLES",
    run: async (client, message, args) => {
        message.delete();

        const nochannelEmbed = new Discord.RichEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Punishments channel not found`)
        const nopermEmbed = new Discord.RichEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ You don't have permission to use this!`)
        const nobotpermEmbed = new Discord.RichEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ I don't have permission to use this, please check my permissions`)
        const noargsEmbed = new Discord.RichEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Please mention a valid user of this server and provide a reason`)
        const nomemberEmbed = new Discord.RichEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Couldn't find that member`)
        const noyourselfEmbed = new Discord.RichEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ You can't unmute yourself`)
        const noroleEmbed = new Discord.RichEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Muted role not found`)
        const alreadyEmbed = new Discord.RichEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ That person is not muted`)
        const canceledEmbed = new Discord.RichEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Mute canceled`)

        let mutedrole = message.guild.roles.find(grole => grole.name === "Muted");
        let puchannel = message.guild.channels.find(puchannel => puchannel.name === "🔨punishments");

        if (!message.member.hasPermission("MANAGE_ROLES")) return message.channel.send(nopermEmbed).then(m => m.delete(5000));
        if (!message.guild.me.hasPermission("MANAGE_ROLES")) return message.channel.send(nobotpermEmbed).then(m => m.delete(5000));
        if (!puchannel) return message.channel.send (nochannelEmbed).then(msg => msg.delete(5000));
        if (!mutedrole) return message.channel.send(noroleEmbed).then(msg => msg.delete(5000));
        if (!args[0] || !args[1]) return message.channel.send(noargsEmbed).then(m => m.delete(5000));
        
        const toUnmute = message.mentions.members.first();
        
        if (!toUnmute.roles.has(mutedrole.id)) return message.channel.send(alreadyEmbed).then(msg => msg.delete(5000));
        if (!toUnmute) return message.channel(nomemberEmbed).then(m => m.delete(5000));
        if (toUnmute.id === message.author.id) return message.channel.send(noyourselfEmbed).then(m => m.delete(5000));

        const embed = new Discord.RichEmbed()
            .setColor(`AQUA`)
            .setThumbnail(toUnmute.user.displayAvatarURL)
            .setTimestamp()
            .setTitle(`UNMUTE`)
            .setDescription(`
            **Member:** ${toUnmute}
            \n**By:** ${message.member}
            \n**Reason:** ${args.slice(1).join(" ")}
            `);

        const promptEmbed = new Discord.RichEmbed()
            .setColor("GREEN")
            .setAuthor(`This verification becomes invalid after 30s.`)
            .setDescription(`Do you want to unmute ${toUnmute}?`)

        // Send the message
        await message.channel.send(promptEmbed).then(async msg => {
            // Await the reactions and the reactioncollector
            const emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);

            // Verification stuffs
            if (emoji === "✅") {
                msg.delete();

                //toUnmute.ban(args.slice(1).join(" "))
                toUnmute.removeRole(mutedrole.id)
                    .catch(err => {
                        const errorEmbed = new Discord.RichEmbed()
                            .setColor(`RED`)
                            .setTitle(`⛔ Error: **${err}**`)
                        if (err) return message.channel.send(errorEmbed).then(msg => msg.delete(5000));
                    });

                puchannel.send(embed);
            }
            else if (emoji === "❌") {
                msg.delete();
                message.channel.send(canceledEmbed).then(m => m.delete(5000));
            }
        });
    }
};
