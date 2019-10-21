const Discord = require("discord.js");

module.exports = {
    name: "giveaway",
    aliases: ["ga"],
    category: "Admin",
    description: "Start a giveaway",
    usage: "Follow instructions",
    permission: "MANAGE_GUILD",
    run: async (client, msg, arg) => {

        const ms = require('ms');
        var duration;
        var prize;
        var filter = m => m.author.id === msg.author.id;

        const nopermEmbed = new Discord.RichEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ You don't have permission to use this!`)
        const nobotpermEmbed = new Discord.RichEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ I don't have permission to do this! Please check my permissions.`)
        const nochannelEmbed = new Discord.RichEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Giveaway channel not found!`)
        const invalidtimeEmbed = new Discord.RichEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Invalid time entered!`)
        const sendtimeEmbed = new Discord.RichEmbed()
            .setColor(`RANDOM`)
            .setTitle(`🎉 Giveaway setup`)
            .setDescription(`**Send time for the Giveaway`)
            .setFooter(`*<number><type>\n Types: s, m, h, d, w*`)
        const sendprizeEmbed = new Discord.RichEmbed()
            .setColor(`RANDOM`)
            .setTitle(`🎉 Giveaway setup`)
            .setDescription(`**Now send the prize**`)

        if(!msg.guild.member(msg.author).hasPermission('MANAGE_GUILD')) return msg.channel.send(nopermEmbed).then(msg => msg.delete(5000));
        let gachannel = msg.guild.channels.find(gachannel => gachannel.name === "🎉giveaway");
        if(!gachannel) return msg.reply(nochannelEmbed).then(msg => msg.delete(5000));
        msg.channel.send(sendtimeEmbed).then(msg => {//collect duration
        msg.channel.awaitMessages(filter, {max: 1,time: 20000,errors: ['time']}).then(collected => {
                if(!collected.first().content.match(/[1-60][s,m,h,d,w]/g)) return msg.channel.send(invalidtimeEmbed).then(msg => msg.delete(5000));
                duration = collected.first().content
                collected.first().delete();
                msg.edit(sendprizeEmbed).then(msg => {//collect prize
                msg.channel.awaitMessages(filter, {max: 1,time: 20000,errors: ['time']}).then(collected => {
                    prize = collected.first().content;
                    collected.first().delete();
                    msg.delete();
                    try {
                    let startEmbed = new Discord.RichEmbed()
                        .setColor(`RANDOM`)
                        .setTitle(`🎉Giveaway Started`)
                        .setDescription(`*React With 🎉 To Enter!*`)
                        .addField(`Prize: **${prize}**`, `Duration: **${duration}**`)
                        .setFooter("Created at:")
                        .setTimestamp()
                    gachannel.send(startEmbed).then(m => {
                        let re = m.react('🎉');
                        setTimeout(() => {
                            let users = m.reactions.get("🎉").users
                            let list = users.array().filter(u => u.id !== client.user.id);
                            let winner = list[Math.floor(Math.random() * list.length)]
                            if (!winner) winner = ("*No Participants*");
                            let endEmbed = new Discord.RichEmbed()
                                .setColor(`RANDOM`)
                                .setTitle(`🎉Giveaway Ended`)
                                .addField(`**Prize:** ${prize}`,`**Winner:** ${winner}`)
                                .setFooter("Ended at:")
                                .setTimestamp()
                            m.edit({embed: endEmbed});
                            if(list == 0) return undefined;
                            gachannel.send(`**Congratulations ${winner}!\nYou won: \`${prize}\`**`)
                        }, ms(duration));
                    });
                    } catch(e) {
                        msg.channel.send(nobotpermEmbed);
                        console.log(e);
                    }
                });
                });
            });
            });
    }
}
