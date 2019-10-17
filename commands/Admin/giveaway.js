const Discord = require("discord.js");

module.exports = {
    name: "giveaway",
    aliases: ["ga"],
    category: "Admin",
    description: "Start a giveaway",
    usage: "Follow",
    run: async (client, msg, arg) => {

        const ms = require('ms');
        var duration;
        var prize;
        var filter = m => m.author.id === msg.author.id;

        if(!msg.guild.member(msg.author).hasPermission('MANAGE_GUILD')) return msg.channel.send("🎉| **Sorry, you don't have permission to use this.**");
        let gachannel = msg.guild.channels.find(gachannel => gachannel.name === "🎉giveaway");
        if(!gachannel) return msg.reply("🎉| Can't find giveaway channel.");
        msg.channel.send(`🎉| **Send time for the Giveaway**`).then(msg => {//collect duration
        msg.channel.awaitMessages(filter, {max: 1,time: 20000,errors: ['time']}).then(collected => {
                if(!collected.first().content.match(/[1-60][s,m,h,d,w]/g)) return msg.channel.send('🎉| **Time not supported**');
                duration = collected.first().content
                collected.first().delete();
                msg.edit('🎉| **Now send The Prize **').then(msg => {//collect prize
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
                            if (!winner) winner = ("No Participants");
                            let endEmbed = new Discord.RichEmbed()
                            .setColor(`RANDOM`)
                            .setTitle(`🎉Giveaway Ended`)
                            .addField(`**Prize:** ${prize}`,`**Winner:** ${winner}`)
                            .setFooter("Ended at:")
                            .setTimestamp()
                            m.edit({embed: endEmbed});
                            if(list == 0) return undefined;
                            gachannel.send(`**Congratulations ${winner}! You won: \`${prize}\`**`)
                        }, ms(duration));
                    });
                    } catch(e) {
                        msg.channel.send(`:heavy_multiplication_x:| **i Don't Have Perm**`);
                        console.log(e);
                    }
                });
                });
            });
            });
    }
}
