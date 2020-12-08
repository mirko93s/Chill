const Discord = require("discord.js");

module.exports = {
    name: "giveaway",
    aliases: ["ga"],
    category: "Admin",
    description: "Start a giveaway in the preset channel",
    usage: "giveaway\n**e.g.**\n\`giveaway\`\n> Follow the instructions\n> Bot will ask you to enter a time and a prize",
    permission: "MANAGE_GUILD",
    run: async (client, msg, arg) => {

        const ms = require('ms');
        var duration;
        var prize;
        var filter = m => m.author.id === msg.author.id;

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
            .setDescription(`**Send time for the Giveaway`)
            .setFooter(`*<number><type>\n Types: s, m, h, d, w*`)
        const sendprizeEmbed = new Discord.MessageEmbed()
            .setColor(`RANDOM`)
            .setTitle(`🎉 Giveaway setup`)
            .setDescription(`**Now send the prize**`)

        if(!msg.guild.member(msg.author).hasPermission('MANAGE_GUILD')) return msg.channel.send(nopermEmbed).then(msg => msg.delete({ timeout: 5000 }));
        let gachannel = msg.guild.channels.cache.find(gachannel => gachannel.name === (client.settings.get(msg.guild.id, "gachannel")));
        if(!gachannel) return msg.reply(nochannelEmbed).then(msg => msg.delete({ timeout: 5000 }));
        msg.channel.send(sendtimeEmbed).then(msg => {//collect duration
        msg.channel.awaitMessages(filter, {max: 1,time: 20000,errors: ['time']}).then(collected => {
                if(!collected.first().content.match(/[1-60][s,m,h,d,w]/g)) return msg.channel.send(invalidtimeEmbed).then(msg => msg.delete({ timeout: 5000 }));
                duration = collected.first().content
                collected.first().delete();
                msg.edit(sendprizeEmbed).then(msg => {//collect prize
                msg.channel.awaitMessages(filter, {max: 1,time: 20000,errors: ['time']}).then(collected => {
                    prize = collected.first().content;
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
                    gachannel.send(startEmbed).then(m => {
                        let re = m.react('🎉');
                        //update time left
                        let live = ms(duration);
                        var livetest = setInterval (liveupdate, 5000);
                        function liveupdate() {
                            live -= 5000;
                            if (live > 0) {
                                let liveEmbed = new Discord.MessageEmbed()
                                    .setColor(`RANDOM`)
                                    .setTitle(`🎉Giveaway Started`)
                                    .setDescription(`*React With 🎉 To Enter!*`)
                                    .addField(`Prize: **${prize}**`, `Time Left: **${ms(live)}**`)
                                    .setFooter("Created at:")
                                    .setTimestamp()
                                m.edit({embed: liveEmbed});
                            } else {
                                clearInterval(livetest);
                                return;
                                }
                        }
                        //set timeout
                        setTimeout(() => {
                            let users = m.reactions.cache.get("🎉").users
                            let list = users.cache.array().filter(u => u.id !== client.user.id); //create array of people who reacted and filter bot reaction
                            let winner = list[Math.floor(Math.random() * list.length)]
                            if (!winner) winner = ("*No Participants*");
                            let endEmbed = new Discord.MessageEmbed()
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
