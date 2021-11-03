const Discord = require("discord.js");

module.exports = {
    name: "unmute",
    category: "Moderation",
    description: "Unmute a member",
    usage: "unmute <mention> <reason>\n**e.g.**\n\`unmute @mirko93s reason\`\n> will unmute mirko93s\n> The unmute will be logged in the punishments channel",
    permission: "MANAGE_ROLES",
    run: async (client, msg, arg) => {

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
        const hierarchyEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ I can't use muted role due to role hierarchy, please put my role above the muted one.`)

            
        if (!msg.member.permissions.has("MANAGE_ROLES")) return msg.channel.send({embeds:[nopermEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
        if (!msg.guild.me.permissions.has("MANAGE_ROLES")) return msg.channel.send({embeds:[nobotpermEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
        let puchannel = msg.guild.channels.cache.find(puchannel => puchannel.id === (client.settings.get(msg.guild.id, "puchannel")));
        if (!puchannel) return msg.channel.send ({embeds:[nochannelEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
        let mutedrole = msg.guild.roles.cache.find(mutedrole => mutedrole.id === (client.settings.get(msg.guild.id, "mutedrole")));
        if (!mutedrole) return msg.channel.send({embeds:[noroleEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
        if (msg.guild.me.roles.highest.position < mutedrole.rawPosition) return msg.channel.send({embeds:[hierarchyEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
        if (!arg[0] || !arg[1]) return msg.channel.send({embeds:[noargsEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
        
        const toUnmute = msg.mentions.members.first();
        
        if (!toUnmute.roles.cache.some(r => r.id === mutedrole)) return msg.channel.send({embeds:[alreadyEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
        if (!toUnmute) return msg.channel.send({embeds:[nomemberEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
        if (toUnmute.id === msg.author.id) return msg.channel.send({embeds:[noyourselfEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));

        const embed = new Discord.MessageEmbed()
            .setColor(`AQUA`)
            .setThumbnail(toUnmute.user.displayAvatarURL())
            .setTimestamp()
            .setTitle(`UNMUTE`)
            .setDescription(`
            **Member:** ${toUnmute}
            \n**By:** ${msg.member}
            \n**Reason:** ${arg.slice(1).join(" ")}
            `);

        const promptEmbed = new Discord.MessageEmbed()
            .setColor("GREEN")
            .setAuthor(`This verification becomes invalid after 30s.`)
            .setDescription(`Do you want to unmute ${toUnmute}?`)

        // Send the msg
        await msg.channel.send({embeds:[promptEmbed]}).then(async promptmsg => {
            // Await the reactions and the reactioncollector
            const emoji = await client.chill.promptMessage(promptmsg, msg.author, 30, ["✅", "❌"]);

            // Verification stuffs
            if (emoji === "✅") {
                promptmsg.delete();

                toUnmute.roles.remove(mutedrole.id)
                    .catch(err => {
                        const errorEmbed = new Discord.MessageEmbed()
                            .setColor(`RED`)
                            .setTitle(`⛔ Error: **${err}**`)
                        if (err) return msg.channel.send({embeds:[errorEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
                    });

                puchannel.send({embeds:[embed]});
            }
            else if (emoji === "❌") {
                promptmsg.delete();
                msg.channel.send({embeds:[canceledEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
            }
        });
    }
};
