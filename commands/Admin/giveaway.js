const Discord = require("discord.js");
const ms = require('ms');
const { stripIndent } = require('common-tags');

module.exports = {
    name: "giveaway",
    aliases: ["ga"],
    category: "Admin",
    description: "Host a giveaway",
    usage: "giveaway\n**e.g.**\n\`giveaway\`\n> Follow the instructions\n> Bot will ask you to enter time, prize and number of winners.",
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
        const outoftimeEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ No answer after 30 seconds, operation canceled.`)
        const invalidtimeEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Invalid time entered!`)
        const invalidprizeEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Prize can't be longer than 240 chatacters`)
        const invalidwinnersnumEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Number of winners must be between 1 and 10`)
        const canceledEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Giveaway has been canceled!`)
        
        if(!msg.guild.members.cache.get(msg.author.id).permissions.has('MANAGE_GUILD')) return msg.channel.send({embeds:[nopermEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5e3));
        let gachannel = msg.guild.channels.cache.find(gachannel => gachannel.id === (client.settings.get(msg.guild.id, "gachannel")));
        if(!gachannel) return msg.channel.send({embeds:[nochannelEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5e3));

        const host = msg.author;
        const filter = m => m.author.id === host.id;
        var time = '', prize = '', winnersnum = '';
        const setupGiveawayEmbed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTitle('🎉Giveaway setup')
            .setDescription(stripIndent`
                > **TIME:**
                Prize:
                Winners:
                `)
            .setFooter('Type cancel at any time to abort the giveaway setup')
        msg.channel.send({embeds:[setupGiveawayEmbed]}).then(msg => {
            // get time
            function getTime(msg, filter) {
                msg.channel.awaitMessages({filter, max: 1, time: 30e3,errors: ['time']}).then(collected => {
                    time = collected.first().content;
                    collected.first().delete();
                    if (time.match('cancel')) {
                        msg.delete();
                        return msg.channel.send({embeds:[canceledEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5e3));
                    } else if (!time.match(/[1-60][s,m,h,d,w]/g)) {
                        msg.channel.send({embeds:[invalidtimeEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5e3));
                        return getTime(msg, filter);
                    } else {
                        setupGiveawayEmbed.setDescription(stripIndent`
                            Time: \`${time}\`
                            > **PRIZE:**
                            Winners:
                            `)
                        msg.edit({embeds:[setupGiveawayEmbed]})
                        return getPrize(msg, filter);
                    }
                }).catch(() => {return msg.edit({embeds:[outoftimeEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5e3));});
            }
            // get prize
            function getPrize(msg, filter) {
                msg.channel.awaitMessages({filter, max: 1, time: 30e3,errors: ['time']}).then(collected => {
                    prize = collected.first().content;
                    collected.first().delete();
                    if (prize.match('cancel')) {
                        msg.delete();
                        return msg.channel.send({embeds:[canceledEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5e3));
                    } else if (prize.length > 240) {
                        msg.channel.send({embeds:[invalidprizeEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5e3));
                        return getPrize(msg, filter);
                    } else {
                        setupGiveawayEmbed.setDescription(stripIndent`
                            Time: \`${time}\`
                            Prize: \`${prize}\`
                            > **WINNERS:**
                            `)
                        msg.edit({embeds:[setupGiveawayEmbed]})
                        return getWinnersNum(msg, filter);
                    }
                }).catch(() => {return msg.edit({embeds:[outoftimeEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5e3));});
            }
            //get winners limit
            function getWinnersNum(msg, filter) {
                msg.channel.awaitMessages({filter, max: 1, time: 30e3,errors: ['time']}).then(collected => {
                    winnersnum = collected.first().content;
                    collected.first().delete();
                    if (winnersnum.match('cancel')) {
                        msg.delete();
                        return msg.channel.send({embeds:[canceledEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5e3));
                    } else if (winnersnum < 1 || winnersnum > 10 || isNaN(winnersnum)) {
                        msg.channel.send({embeds:[invalidwinnersnumEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5e3));
                        return getWinnersNum(msg, filter);
                    }
                    else return askconfirm(msg);
                }).catch(() => {return msg.edit({embeds:[outoftimeEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5e3));});
            }

            function askconfirm(msg) {
                setupGiveawayEmbed
                    .setDescription(stripIndent`
                        Time: \`${time}\`
                        Prize: \`${prize}\`
                        Winners: \`${winnersnum}\`
                        `)
                const buttonsRow = new Discord.MessageActionRow()
                    .addComponents(
                        new Discord.MessageButton()
                            .setCustomId('confirm')
                            .setLabel('Confirm')
                            .setStyle('SUCCESS'),
                        new Discord.MessageButton()
                            .setCustomId('cancel')
                            .setLabel('Cancel')
                            .setStyle('DANGER')
                    );
                msg.edit({embeds:[setupGiveawayEmbed], components:[buttonsRow]}).then(sent => {
                    const buttonFilter = (interaction) => {
                        interaction.deferUpdate();
                        if (interaction.user.id === host.id) return true;
                    }
                    const collector = sent.createMessageComponentCollector({ buttonFilter, max: 1, componentType: 'BUTTON', time: 30e3 });
                    collector.on('collect', collected => {
                        sent.delete();
                        if(collected.customId == "confirm") return startGiveaway(time, prize, winnersnum);
                        else if(collected.customId == "cancel") return msg.channel.send({embeds:[canceledEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5e3));
                    });
                })
            }

            function startGiveaway(duration, prize, numwinners) {
                try {
                    const startEmbed = new Discord.MessageEmbed()
                        .setColor(`RANDOM`)
                        .setTitle(`🎉Giveaway Started`)
                        .setDescription(`*React With 🎉 To Enter!*`)
                        .addField(`Prize: **${prize}**`, `Time Left: **${duration}**\nMax winners: ${numwinners}`)
                        .setFooter(`Hosted by ${host.tag}\nAt`,host.displayAvatarURL())
                        .setTimestamp()
                    const keepdate = Date.now();
                    gachannel.send({embeds:[startEmbed]}).then(sent => {
                        sent.react('🎉');
                        //update time left
                        let live = ms(duration);
                        var livetest = setInterval (liveupdate, 30e3);
                        function liveupdate() {
                            live -= 30e3;
                            if (live > 0) {
                                let liveEmbed = new Discord.MessageEmbed()
                                    .setColor(`RANDOM`)
                                    .setTitle(`🎉Giveaway Started`)
                                    .setDescription(`*React With 🎉 To Enter!*`)
                                    .addField(`Prize: **${prize}**`, `Time Left: **${ms(live)}**\nMax winners: ${numwinners}`)
                                    .setFooter(`Hosted by ${host.tag}\nAt`,host.displayAvatarURL())
                                    .setTimestamp(keepdate)
                                sent.edit({embeds:[liveEmbed]});
                            } else return clearInterval(livetest);
                        }
                        //set timeout
                        setTimeout(() => {
                            sent.reactions.cache.get("🎉").users.fetch().then(r => {
                                if (r.size < numwinners) numwinners = r.size;
                                let winner = r.filter(u => u.id !== client.user.id).random(numwinners);
                                const endEmbed = new Discord.MessageEmbed()
                                    .setColor(`RANDOM`)
                                    .setTitle(`🎉Giveaway Ended`)
                                    .addField(`**Prize:** ${prize}`,`**Winner${winner.length > 1 ? 's' : ''}:** ${winner == 0 ? "*No Participants*" : winner}`)
                                    .setFooter(`Hosted by ${host.tag}\nEnded at`,host.displayAvatarURL())
                                    .setTimestamp()
                                sent.edit({embeds:[endEmbed]});
                                if(winner == 0) return;
                                else gachannel.send(`**Congratulations ${winner}!\nYou won: \`${prize}\`**`)
                            });
                        }, ms(duration));
                    });
                } catch(err) {
                    msg.channel.send({embeds:[nobotpermEmbed]});
                    console.log(err);
                }
            }
            getTime(msg,filter);
        });
    }
}