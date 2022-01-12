const Discord = require('discord.js');
const ms = require('ms');

module.exports = async function (client, interaction, embed) {
    // resume remindme
    const reminders = client.intervals.get('reminders');
    function reminder(id, text) {
        const reminderEmbed = new Discord.MessageEmbed()
            .setColor(`RANDOM`)
            .setTitle(`**REMINDER**`)
            .setDescription(text)
        client.intervals.delete('reminders',id)
        client.users.fetch(id.split('-')[0]).then(user => {
            user.send({embeds:[reminderEmbed]}).catch(() => {return});
        })
    }
    for (const [id, text] of Object.entries(reminders)) {
        if (id.split('-')[1] < Date.now()) { // if reminder timestamp is older than date.now send the dm
            reminder(id, text);
        } else { // if reminder timestamp is newer start a new timeout
            setTimeout(reminder, id.split('-')[1]-Date.now(), id, text);
        }
    }
    // resume giveaways
    const giveaways = client.intervals.get('giveaways');
    for (const [id, data] of Object.entries(giveaways)) {
        client.channels.fetch(data.channel).then(channel => {
            channel.messages.fetch(id).then(sent => {
                const embed_data = sent.embeds[0];
                if(data.timestamp > Date.now()) {
                    const keepdate = embed_data.timestamp;
                    // update time left
                    const time = data.timestamp-Date.now();
                    let live = time;
                    var livetest = setInterval(liveupdate, 30e3);
                    function liveupdate() {
                        live -= 30e3;
                        if (live > 0) {
                            let liveEmbed = new Discord.MessageEmbed()
                                .setColor(`RANDOM`)
                                .setTitle(`🎉Giveaway Started`)
                                .setDescription(`*React With 🎉 To Enter!*`)
                                .addField(embed_data.fields[0].name,`Time Left: **${ms(live)}**\n${embed_data.fields[0].value.split('\n')[1]}`)
                                .setFooter({text: embed_data.footer.text, iconURL: embed_data.footer.iconURL})
                                .setTimestamp(keepdate)
                            sent.edit({embeds:[liveEmbed]});
                        } else return clearInterval(livetest);
                    }
                    // set new timeout for winners
                    setTimeout(() => {
                        sent.reactions.cache.get("🎉").users.fetch().then(r => {
                            let winnersnum = embed_data.fields[0].value.split('winners: ')[1];
                            if (r.size < winnersnum) winnersnum = r.size;
                            let winner = r.filter(u => u.id !== client.user.id).random(winnersnum);
                            const endEmbed = new Discord.MessageEmbed()
                                .setColor(`RANDOM`)
                                .setTitle(`🎉Giveaway Ended`)
                                .addField(embed_data.fields[0].name,`**Winner${winner.length > 1 ? 's' : ''}:** ${winner == 0 ? "*No Participants*" : winner}`)
                                .setFooter({text: `${embed_data.footer.text.split('\n')[0]}\nEnded at`, iconURL: embed_data.footer.iconURL})
                                .setTimestamp()
                            sent.edit({embeds:[endEmbed]});
                            if(winner == 0) return;
                            else channel.send(`**Congratulations ${winner}!\nYou won: \`${embed_data.fields[0].name.split('Prize: ')[1].slice(2, -2)}\`**`)
                        });
                        client.intervals.delete('giveaways',id);
                    }, time);
                } else {
                    sent.reactions.cache.get("🎉").users.fetch().then(r => {
                        let winnersnum = embed_data.fields[0].value.split('winners: ')[1];
                        if (r.size < winnersnum) winnersnum = r.size;
                        let winner = r.filter(u => u.id !== client.user.id).random(winnersnum);
                        const endEmbed = new Discord.MessageEmbed()
                            .setColor(`RANDOM`)
                            .setTitle(`🎉Giveaway Ended`)
                            .addField(embed_data.fields[0].name,`**Winner${winner.length > 1 ? 's' : ''}:** ${winner == 0 ? "*No Participants*" : winner}`)
                            .setFooter({text: `${embed_data.footer.text.split('\n')[0]}\nEnded at`, iconURL: embed_data.footer.iconURL})
                            .setTimestamp()
                        sent.edit({embeds:[endEmbed]});
                        if(winner == 0) return;
                        else channel.send(`**Congratulations ${winner}!\nYou won: \`${embed_data.fields[0].name.split('Prize: ')[1].slice(2, -2)}\`**`)
                    });
                    client.intervals.delete('giveaways',id);
                }
            })
        })
    }
}