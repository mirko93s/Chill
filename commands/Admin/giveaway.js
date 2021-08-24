const Discord = require("discord.js");
const ms = require('ms');

module.exports = {
    name: "giveaway",
    aliases: ["ga"],
    category: "Admin",
    description: "Start a giveaway in the preset channel",
    usage: "giveaway\n**e.g.**\n\`giveaway\`\n> Follow the instructions\n> Bot will ask you to enter a time and a prize",
    permission: "MANAGE_GUILD",
    run: async (client, msg, arg) => {
    
        const nopermEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ You don't have permission to use this!`)
        const nobotpermEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ I don't have permission to do this! Please check my permissions.`)
        const nochannelEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Giveaway channel not found!`)
        const invalidtimeEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Invalid time entered!`)
        const sendtimeEmbed = new Discord.MessageEmbed()
            .setColor(`RANDOM`)
            .setTitle(`🎉 Giveaway setup`)
            .setDescription(`**Send time for the Giveaway**`)
            .setFooter(`<number><type>\nTypes: s, m, h, d, w`)
        const sendprizeEmbed = new Discord.MessageEmbed()
            .setColor(`RANDOM`)
            .setTitle(`🎉 Giveaway setup`)
            .setDescription(`**Now send the prize**`)
        const outoftimeEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ No answer after 30 seconds, operation canceled.`)
        const toolongEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Prize can't be longer than 240 chatacters`)
        
        if(!msg.guild.members.cache.get(msg.author.id).permissions.has('MANAGE_GUILD')) return msg.channel.send({embeds:[nopermEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
        let gachannel = msg.guild.channels.cache.find(gachannel => gachannel.id === (client.settings.get(msg.guild.id, "gachannel")));
        if(!gachannel) return msg.channel.send({embeds:[nochannelEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));

        var filter = m => m.author.id === msg.author.id;
        msg.channel.send({embeds:[sendtimeEmbed]}).then(msg => {//collect duration
            msg.channel.awaitMessages({filter, max: 1,time: 30000,errors: ['time']}).then(collected => {
                if(!collected.first().content.match(/[1-60][s,m,h,d,w]/g)) return msg.channel.send({embeds:[invalidtimeEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
                var duration = collected.first().content;
                collected.first().delete();
                msg.edit({embeds:[sendprizeEmbed]}).then(msg => {//collect prize
                    msg.channel.awaitMessages({filter, max: 1,time: 30000,errors: ['time']}).then(collected => {
                        var prize = collected.first().content;
                        if (prize.length > 240) return msg.channel.send({embeds:[toolongEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
                        collected.first().delete();
                        msg.delete();
                        try {
                            let startEmbed = new Discord.MessageEmbed()
                                .setColor(`RANDOM`)
                                .setTitle(`🎉Giveaway Started`)
                                .setDescription(`*React With 🎉 To Enter!*`)
                                .addField(`Prize: **${prize}**`, `Time Left: **${duration}**`)
                                .setFooter("Created at:")
                                .setTimestamp()
                            gachannel.send({embeds:[startEmbed]}).then(m => {
                                m.react('🎉');
                                //update time left
                                let live = ms(duration);
                                var livetest = setInterval (liveupdate, 30000);
                                function liveupdate() {
                                    live -= 30000;
                                    if (live > 0) {
                                        let liveEmbed = new Discord.MessageEmbed()
                                            .setColor(`RANDOM`)
                                            .setTitle(`🎉Giveaway Started`)
                                            .setDescription(`*React With 🎉 To Enter!*`)
                                            .addField(`Prize: **${prize}**`, `Time Left: **${ms(live)}**`)
                                            .setFooter("Created at:")
                                            .setTimestamp()
                                        m.edit({embeds:[liveEmbed]});
                                    } else {
                                        clearInterval(livetest);
                                        return;
                                        }
                                }
                                //set timeout
                                setTimeout(() => {
                                    m.reactions.cache.get("🎉").users.fetch().then(r => {
                                        let winner = r.filter(u => u.id !== client.user.id).random(1);
                                        let endEmbed = new Discord.MessageEmbed()
                                            .setColor(`RANDOM`)
                                            .setTitle(`🎉Giveaway Ended`)
                                            .addField(`**Prize:** ${prize}`,`**Winner:** ${winner == 0 ? "*No Participants*" : winner}`)
                                            .setFooter("Ended at:")
                                            .setTimestamp()
                                        m.edit({embeds:[endEmbed]});
                                        if(winner == 0) return;
                                        gachannel.send(`**Congratulations ${winner}!\nYou won: \`${prize}\`**`)
                                    });
                                }, ms(duration));
                            });
                        } catch(err) {
                            msg.channel.send({embeds:[nobotpermEmbed]});
                            console.log(err);
                        }
                    }).catch(() => {return msg.edit({embeds:[outoftimeEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));});
                });
            }).catch(() => {return msg.edit({embeds:[outoftimeEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));});
        });
    }
}
