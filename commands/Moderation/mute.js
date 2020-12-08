const Discord = require("discord.js");
const { stripIndents } = require("common-tags");
const { promptMessage } = require("../../functions.js");

module.exports = {
    name: "mute",
    category: "Moderation",
    description: "Mute a member",
    usage: "mute <mention> <reason>\n**e.g.**\n\`mute @mirko93s reason\`\n> will mute mirko93s\n> The mute will be logged in the punishments channel",
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

        let mutedrole = message.guild.roles.cache.find(mutedrole => mutedrole.name === (client.settings.get(message.guild.id, "mutedrole")));
        let puchannel = message.guild.channels.cache.find(puchannel => puchannel.name === (client.settings.get(message.guild.id, "puchannel")));

        if (!message.member.hasPermission("MANAGE_ROLES")) return message.channel.send(nopermEmbed).then(msg => msg.delete({ timeout: 5000 }));
        if (!message.guild.me.hasPermission("MANAGE_ROLES")) return message.channel.send(nobotpermEmbed).then(msg => msg.delete({ timeout: 5000 }));
        if (!puchannel) return message.channel.send (nochannelEmbed).then(msg => msg.delete({ timeout: 5000 }));
        if (!mutedrole) return message.channel.send(noroleEmbed).then(msg => msg.delete({ timeout: 5000 }));
        if (!args[0] || !args[1]) return message.channel.send(noargsEmbed).then(m => m.delete({timeout:5000}));
        
        const toMute = message.mentions.members.first();

        if (toMute.roles.cache.some(r => r.id === mutedrole.id)) return message.channel.send(alreadyEmbed).then(msg => msg.delete({ timeout: 5000 }));
        if (!toMute) return message.channel(nomemberEmbed).then(msg => msg.delete({ timeout: 5000 }));
        if (toMute.id === message.author.id) return message.channel.send(noyourselfEmbed).then(msg => msg.delete({ timeout: 5000 }));

        const embed = new Discord.MessageEmbed()
            .setColor(`GOLD`)
            .setThumbnail(toMute.user.displayAvatarURL())
            .setTimestamp()
            .setTitle(`MUTE`)
            .setDescription(`
            **Member:** ${toMute}
            \n**By:** ${message.member}
            \n**Reason:** ${args.slice(1).join(" ")}
            `);

        const promptEmbed = new Discord.MessageEmbed()
            .setColor("GREEN")
            .setAuthor(`This verification becomes invalid after 30s.`)
            .setDescription(`Do you want to mute ${toMute}?`)

        // Send the message
        await message.channel.send(promptEmbed).then(async msg => {
            // Await the reactions and the reactioncollector
            const emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);

            // Verification stuffs
            if (emoji === "✅") {
                msg.delete();

                //toMute.ban(args.slice(1).join(" "))
                toMute.roles.add(mutedrole.id)
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
