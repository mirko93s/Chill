const Discord = require("discord.js");
const ms = require('ms');

module.exports = {
    name: "giveaway",
    description: "Host a Giveaway",
    userPerms: ['MANAGE_GUILD'],
    botPerms: ['ADMINISTRATOR'],
    options: [
        {
            name: "time",
            description: "Time",
            type: 'INTEGER',
            required: true,
            minValue: 1,
            maxValue: 60,
        },
        {
            name: "unit",
            description: "Time unit",
            type: 'STRING',
            required: true,
            choices: [
                {
                    name: "seconds",
                    value: "s",
                },
                {
                    name: "minutes",
                    value: "m",
                },
                {
                    name: "hours",
                    value: "h",
                },
                {
                    name: "days",
                    value: "d",
                }
            ]
        },
        {
            name: 'prize',
            description: 'What will the prize be?',
            type: 'STRING',
            required: true,
        },
        {
            name: 'winners',
            description: 'How many winners? If blank defaults to 1',
            type: 'INTEGER',
            minValue: 1,
            maxValue: 10,
        },
        {
            name: 'channel',
            description: 'Channel to start the Giveaway in. If blank defaults to Guild Config Giveaway channel',
            type: 'CHANNEL',
            channelTypes: ['GUILD_TEXT']
        },
    ],
    run: async (client, interaction, arg) => {
    
        const nobotpermEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ I don't have permission to do this! Please check my permissions.`)
        const nochannelEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Giveaway channel not found!`)
        const invalidprizeEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Prize can't be longer than 250 chatacters`)
        
        const gachannel = interaction.options.getChannel('channel') || interaction.guild.channels.cache.find(gachannel => gachannel.id === (client.settings.get(interaction.guild.id, "gachannel")));
        if(!gachannel) return interaction.reply({ephemeral:true, embeds:[nochannelEmbed]});
        const time = interaction.options.getInteger('time')+interaction.options.getString('unit');
        const prize = interaction.options.getString('prize');
        if (prize.length > 250) return interaction.reply({ephemeral:true, embeds:[invalidprizeEmbed]});
        let winnersnum = interaction.options.getInteger('winners') || 1;
        const host = interaction.user;

        try {
            const startEmbed = new Discord.MessageEmbed()
                .setColor(`RANDOM`)
                .setTitle(`🎉 Giveaway Started`)
                .setDescription(`*React With 🎉 To Enter!*`)
                .addField(`🎁 Prize`, `**${prize}**`, false)
                .addField(`🕒 Ends **<t:${((Date.now()+ms(time))/1e3).toFixed()}:R>**`, `Max winners: ${winnersnum}`)
                .setFooter({text: `Hosted by ${host.tag}\nAt`, iconURL: host.displayAvatarURL()})
                .setTimestamp()
            gachannel.send({embeds:[startEmbed]}).then(sent => {
                client.intervals.set('giveaways',{timestamp: Date.now()+ms(time),channel: gachannel.id}, sent.id)
                const doneEmbed = new Discord.MessageEmbed()
                    .setColor('RANDOM')
                    .setDescription(`✅ Giveaway started in ${gachannel}`)
                interaction.reply({ephemeral:true, embeds:[doneEmbed]});
                sent.react('🎉');
                setTimeout(() => {
                    sent.reactions.cache.get("🎉").users.fetch().then(r => {
                        if (r.size < winnersnum) winnersnum = r.size;
                        let winner = r.filter(u => u.id !== client.user.id).random(winnersnum);
                        const endEmbed = new Discord.MessageEmbed()
                            .setColor(`RANDOM`)
                            .setTitle(`🎉 Giveaway Ended`)
                            .addField(`🎁 Prize`, `**${prize}**`, false)
                            .addField(`**Winner${winner.length > 1 ? 's' : ''}**`, `**${winner == 0 ? "No Participants" : winner}**`)
                            .setFooter({text: `Hosted by ${host.tag}\nEnded at`, iconURL: host.displayAvatarURL()})
                            .setTimestamp()
                        sent.edit({embeds:[endEmbed]});
                        if(winner == 0) return;
                        else gachannel.send(`**Congratulations ${winner}!\nYou won: \`${prize}\`**`)
                    });
                    client.intervals.delete('giveaways',sent.id);
                }, ms(time));
            });
        } catch(err) {
            interaction.reply({embeds:[nobotpermEmbed]});
            return console.log(err);
        }
    }
}