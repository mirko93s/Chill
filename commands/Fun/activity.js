const Discord = require("discord.js");

module.exports = {
    name: "activities",
    aliases: ['act','activity'],
    category: "Fun",
    description: "Start a Discord Activity",
    usage: "activity\n**e.g.**\n\`activity\`\n> Select an activity from the menu",
    run: async (client, msg, arg) => {
        const menu = new Discord.MessageSelectMenu()
            .setCustomId('select')
            .setPlaceholder('Select an Activity')
            .addOptions([
                {label: 'Youtube',value: 'youtube',},
                {label: 'Poker',value: 'poker',},
                {label: 'Chess',value: 'chess',},
                {label: 'Betrayal',value: 'betrayal',},
                {label: 'Fishington',value: 'fishing',},
                {label: 'Letter Tile',value: 'lettertile',},
                {label: 'Words Snack',value: 'wordsnack',},
                {label: 'Doodle Crew',value: 'doodlecrew',},
                {label: 'SpellCast',value: 'spellcast',},
                {label: 'Awkword',value: 'awkword',},
            ]);
        let row = new Discord.MessageActionRow().addComponents(menu);

        const activityEmbed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTitle('Discord Activities')
        msg.channel.send({embeds:[activityEmbed],components:[row]}).then(sent => {

            const filter = (interaction) => {
                interaction.deferUpdate();
                if (interaction.user.id === msg.author.id) return true;
                return;
            }

            const collector = sent.createMessageComponentCollector({ filter, componentType: 'SELECT_MENU', time: 60e3 });
        
            collector.on('collect', collected => {                
                if(msg.member.voice.channel) {
                    collector.stop();
                    const formattedActivities = {youtube:'Youtube',poker:'Poker',chess:'Chess',betrayal:'Betrayal',fishing:'Fishington',lettertile:'Letter Tile',wordsnack:'Words Snack',doodlecrew:'Doodle Crew',spellcast:'Spellcast',awkword:'Awkword'};
                    client.discordTogether.createTogetherCode(msg.member.voice.channel.id, collected.values[0]).then(async invite => {
                        activityEmbed
                            .setDescription(`[Click Here](${invite.code}) to access ${formattedActivities[collected.values[0]]}!`)
                            .setColor("RANDOM")
                            .setFooter(`Requested By: ${msg.member.user.username}`,msg.author.displayAvatarURL({size: 4096, dynamic: true}))
                        return sent.edit({embeds:[activityEmbed]});
                    });
                } else {
                    activityEmbed
                        .setDescription(`⛔ Join a Voice Channel and try again!`)
                        .setColor("RED")
                        return sent.edit({embeds:[activityEmbed]});
                }
            });  
            collector.on('end', (collected, reason) => {
                if (reason === 'time') {
                    activityEmbed
                        .setDescription(`⛔ Timed out!`)
                    return sent.edit({ embeds:[activityEmbed], components:[] }).then(msg => setTimeout(() => msg.delete(), 5e3));
                } else return sent.edit({ components:[] });
            });
        })
    }
}
