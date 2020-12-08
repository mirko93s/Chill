const Discord = require("discord.js");
const { stripIndents } = require("common-tags");
const { promptMessage } = require("../../functions.js");

module.exports = {
    name: "unmute",
    category: "Moderation",
    description: "Unmute a member",
    usage: "unmute <mention> <reason>\n**e.g.**\n\`unmute @mirko93s reason\`\n> will unmute mirko93s\n> The unmute will be logged in the punishments channel",
    permission: "MANAGE_ROLES",
    run: async (client, message, args) => {
        message.delete();

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
            .setTitle(`⛔ You can't unmute yourself`)
        const noroleEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Muted role not found`)
        const alreadyEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ That person is not muted`)
        const canceledEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Mute canceled`)

        let mutedrole = message.guild.roles.cache.find(mutedrole => mutedrole.name === (client.settings.get(message.guild.id, "mutedrole")));
        let puchannel = message.guild.channels.cache.find(puchannel => puchannel.name === (client.settings.get(message.guild.id, "puchannel")));

        if (!message.member.hasPermission("MANAGE_ROLES")) return message.channel.send(nopermEmbed).then(msg => msg.delete({ timeout: 5000 }));
        if (!message.guild.me.hasPermission("MANAGE_ROLES")) return message.channel.send(nobotpermEmbed).then(msg => msg.delete({ timeout: 5000 }));
        if (!puchannel) return message.channel.send (nochannelEmbed).then(msg => msg.delete({ timeout: 5000 }));
        if (!mutedrole) return message.channel.send(noroleEmbed).then(msg => msg.delete({ timeout: 5000 }));
        if (!args[0] || !args[1]) return message.channel.send(noargsEmbed).then(msg => msg.delete({ timeout: 5000 }));
        
        const toUnmute = message.mentions.members.first();
        
        if (!toUnmute.roles.cache.some(r => r.id === mutedrole.id)) return message.channel.send(alreadyEmbed).then(msg => msg.delete({ timeout: 5000 }));
        if (!toUnmute) return message.channel(nomemberEmbed).then(msg => msg.delete({ timeout: 5000 }));
        if (toUnmute.id === message.author.id) return message.channel.send(noyourselfEmbed).then(msg => msg.delete({ timeout: 5000 }));

        const embed = new Discord.MessageEmbed()
            .setColor(`AQUA`)
            .setThumbnail(toUnmute.user.displayAvatarURL())
            .setTimestamp()
            .setTitle(`UNMUTE`)
            .setDescription(`
            **Member:** ${toUnmute}
            \n**By:** ${message.member}
            \n**Reason:** ${args.slice(1).join(" ")}
            `);

        const promptEmbed = new Discord.MessageEmbed()
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
                toUnmute.roles.remove(mutedrole.id)
                    .catch(err => {
                        const errorEmbed = new Discord.MessageEmbed()
                            .setColor(`RED`)
                            .setTitle(`⛔ Error: **${err}**`)
                        if (err) return message.channel.send(errorEmbed).then(msg => msg.delete({ timeout: 5000 }));
                    });

                puchannel.send(embed);
            }
            else if (emoji === "❌") {
                msg.delete();
                message.channel.send(canceledEmbed).then(msg => msg.delete({ timeout: 5000 }));
            }
        });
    }
};
