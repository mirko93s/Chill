const Discord = require("discord.js");
const { stripIndents } = require("common-tags");
const { promptMessage } = require("../../functions.js");

module.exports = {
    name: "kick",
    category: "Moderation",
    description: "Kicks the member",
    usage: "<id | mention>",
    permission: "KICK_MEMBERS",
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
            .setTitle(`⛔ You can't kick yourself`)
        const hierarchyEmbed = new Discord.RichEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ I can't kick that person due to role hierarchy, I suppose`)
        const canceledEmbed = new Discord.RichEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Kick canceled`)

        let puchannel = message.guild.channels.find(puchannel => puchannel.name === "🔨punishments");

        if (!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send(nopermEmbed).then(m => m.delete(5000));
        if (!message.guild.me.hasPermission("KICK_MEMBERS")) return message.channel.send(nobotpermEmbed).then(m => m.delete(5000));
        if (!puchannel) return message.channel.send (nochannelEmbed).then(msg => msg.delete(5000));
        if (!args[0] || !args[1]) return message.channel.send(noargsEmbed).then(m => m.delete(5000));

        const toKick = message.mentions.members.first();

        if (!toKick) return message.channel.send(nomemberEmbed).then(m => m.delete(5000));
        if (toKick.id === message.author.id) return message.channel.send(noyourselfEmbed).then(m => m.delete(5000));
        if (!toKick.kickable) return message.channel.send(hierarchyEmbed).then(m => m.delete(5000));
                
        const embed = new Discord.RichEmbed()
            .setColor(`ORANGE`)
            .setThumbnail(toKick.user.displayAvatarURL)
            .setTimestamp()
            .setTitle(`KICK`)
            .setDescription(`
            **Member:** ${toKick.user.username}
            \n**By:** ${message.member}
            \n**Reason:** ${args.slice(1).join(" ")}
            `);

        const promptEmbed = new Discord.RichEmbed()
            .setColor("GREEN")
            .setAuthor(`This verification becomes invalid after 30s.`)
            .setDescription(`Do you want to kick ${toKick}?`)

        // Send the message
        await message.channel.send(promptEmbed).then(async msg => {
            // Await the reactions and the reaction collector
            const emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);

            // The verification stuffs
            if (emoji === "✅") {
                msg.delete();

                toKick.kick(args.slice(1).join(" "))
                    .catch(err => {
                        const errorEmbed = new Discord.RichEmbed()
                            .setColor(`RED`)
                            .setTitle(`⛔ Error: **${err}**`)
                        if (err) return message.channel.send(errorEmbed).then(msg => msg.delete(5000));
                    });

                puchannel.send(embed);
            } else if (emoji === "❌") {
                msg.delete();
                message.channel.send(canceledEmbed).then(m => m.delete(5000));
            }
        });
    }
};
