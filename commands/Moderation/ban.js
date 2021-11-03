const Discord = require("discord.js");

module.exports = {
    name: "ban",
    category: "Moderation",
    description: "Ban a member in your server",
    usage: "ban <id | mention> <reason>\n**e.g.**\n\`ban @mirko93s reason\`\n> will ban mirko93s from your server\n> The ban will be logged in the punishments channel",
    permission: "BAN_MEMBERS",
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
            .setTitle(`⛔ You can't ban yourself`)
        const hierarchyEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ I can't ban that person due to role hierarchy, I suppose`)
        const canceledEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Ban canceled`)

            
        if (!msg.member.permissions.has("BAN_MEMBERS")) return msg.channel.send({embeds:[nopermEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
        if (!msg.guild.me.permissions.has("BAN_MEMBERS")) return msg.channel.send({embeds:[nobotpermEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
        let puchannel = msg.guild.channels.cache.find(puchannel => puchannel.id === (client.settings.get(msg.guild.id, "puchannel")));
        if (!puchannel) return msg.channel.send({embeds:[nochannelEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
        if (!arg[0] || !arg[1]) return msg.channel.send({embeds:[noargsEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));

        const toBan = msg.mentions.members.first();

        if (!toBan) return msg.channel.send({embeds:[nomemberEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
        if (toBan.id === msg.author.id) return msg.channel.send({embeds:[noyourselfEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
        if (!toBan.bannable) return msg.channel.send({embeds:[hierarchyEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));

        const embed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setThumbnail(toBan.user.displayAvatarURL())
            .setTimestamp()
            .setTitle(`BAN`)
            .setDescription(`
            **Member:** ${toBan.user.username}
            \n**By:** ${msg.member}
            \n**Reason:** ${arg.slice(1).join(" ")}
            `);

        const promptEmbed = new Discord.MessageEmbed()
            .setColor("GREEN")
            .setAuthor(`This verification becomes invalid after 30s.`)
            .setDescription(`Do you want to ban ${toBan}?`)

        await msg.channel.send({embeds:[promptEmbed]}).then(async promptmsg => {
            const emoji = await client.chill.promptMessage(promptmsg, msg.author, 30, ["✅", "❌"]);

            // Verification stuffs
            if (emoji === "✅") {
                promptmsg.delete();

                toBan.ban({days: 0, reason: arg.slice(1).join(" ")})
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
