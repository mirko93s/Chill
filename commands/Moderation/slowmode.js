const Discord = require("discord.js");
const ms = require("ms");

module.exports = {
    name: "slowmode",
    aliases: ["slowmo"],
    category: "Moderation",
    description: "Enable/Disable slow-mode in the channel you are in",
    usage: "slowmode\n**e.g.**\n\`slowmode\`\n> Select a slow-mode delay using the menu",
    permission: "MANAGE_CHANNELS",
    run: async (client, msg, arg) => {

        const nopermEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ You don't have permission to use this!`)

        if (!msg.member.permissions.has("MANAGE_CHANNELS")) return msg.channel.send({embeds:[nopermEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));

        const menu = new Discord.MessageSelectMenu()
            .setCustomId('select')
            .setPlaceholder('Select a delay')
            .addOptions([
                {label: 'OFF',value: 'OFF',},
                {label: '5s',value: '5s',},
                {label: '10s',value: '10s',},
                {label: '15s',value: '15s',},
                {label: '30s',value: '30s',},
                {label: '1m',value: '1m',},
                {label: '2m',value: '2m',},
                {label: '5m',value: '5m',},
                {label: '10m',value: '10m',},
                {label: '15m',value: '15m',},
                {label: '30m',value: '30m',},
                {label: '1h',value: '1h',},
                {label: '2h',value: '2h',},
                {label: '6h',value: '6h',}
            ]);
        let row = new Discord.MessageActionRow().addComponents(menu);

        const slowmoEmbed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTitle('Slow-Mode')
        msg.channel.send({embeds:[slowmoEmbed],components:[row]}).then(sent => {

            const filter = (interaction) => {
                interaction.deferUpdate();
                if (interaction.user.id === msg.author.id) return true;
                return;
            }

            const collector = sent.createMessageComponentCollector({ filter, componentType: 'SELECT_MENU', time: 30e3 });
        
            collector.on('collect', collected => {
                collector.resetTimer({ time: 30e3 });
                menu.setPlaceholder(`Set to: ${collected.values[0]}`);
                row = new Discord.MessageActionRow().addComponents(menu);
                if (collected.values[0] !== 'OFF') {
                    slowmoEmbed
                        .setDescription('Enabled')
                        .setColor('GREEN')
                }
                else {
                    slowmoEmbed
                        .setDescription('Disabled')
                        .setColor('RED')
                }
                msg.channel.setRateLimitPerUser(isNaN(ms(collected.values[0])/1e3) ? 0 : ms(collected.values[0])/1e3 );
                return sent.edit({ embeds:[slowmoEmbed], components:[row] });
            });
    
            collector.on('end', collected => {
                menu.setDisabled(true);
                row = new Discord.MessageActionRow().addComponents(menu);
                return sent.edit({ components:[row] });
            });

        })

        
    }
}
