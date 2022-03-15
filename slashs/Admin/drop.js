const Discord = require("discord.js");
const { stripIndent } = require('common-tags');

module.exports = {
    name: "drop",
    description: "Host a Drop",
    userPerms: ['MANAGE_GUILD'],
    botPerms: ['VIEW_CHANNEL','SEND_MESSAGES','EMBED_LINKS'],
    options: [
        {
            name: 'prize',
            description: 'What will the prize be?',
            type: 'STRING',
            required: true,
        },
        {
            name: 'channel',
            description: 'Channel to send the drop to, if blank defaults to Guild Config Giveaway channel',
            type: 'CHANNEL',
            channelTypes: ['GUILD_TEXT'],
        },
    ],
    run: async (client, interaction, arg) => {
    
        const nochannelEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Giveaway channel not found!`)
        const noprizeEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Please provide a valid prize for the Drop`)

        const gachannel = interaction.options.getChannel('channel') || interaction.guild.channels.cache.find(gachannel => gachannel.id === (client.settings.get(interaction.guild.id, "gachannel")));
        if(!gachannel) return interaction.reply({ephemeral:true, embeds:[nochannelEmbed]});

        const prize = interaction.options.getString('prize');
        if (prize.length > 3072) return interaction.reply({ephemeral:true, embeds:[noprizeEmbed]});

        const dropEmbed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTitle('🎁 Drop')
            .setDescription(`**Prize:** ${prize}`)
            .setFooter({text: 'Click the button below to Claim the Drop'})

        const claimbutton = new Discord.MessageButton()
            .setCustomId('claim')
            .setLabel('Claim')
            .setStyle('PRIMARY')
        let buttonrow = new Discord.MessageActionRow().addComponents(claimbutton)
        
        const doneEmbed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setDescription(`✅ Drop started in ${gachannel}`)
        interaction.reply({ephemeral:true, embeds:[doneEmbed]})

        gachannel.send({embeds:[dropEmbed], components:[buttonrow]}).then(sent => {
            const filter = (_interaction) => {
                _interaction.deferUpdate();
                if (!_interaction.user.bot) return true;
            }
            const collector = sent.createMessageComponentCollector({ filter, max: 1, componentType: 'BUTTON'});
            collector.on('collect', collected => {              
                claimbutton.setLabel('Claimed').setStyle('SECONDARY').setDisabled(true);
                buttonrow = new Discord.MessageActionRow().addComponents(claimbutton);

                const winnerEmbed = new Discord.MessageEmbed()
                    .setColor('RANDOM')
                    .setTitle('🎁 Drop')
                    .setDescription(stripIndent`
                    **Prize:** ${prize}
                    **Winner:** ${collected.user}
                    `)

                sent.edit({embeds:[winnerEmbed], components:[buttonrow]});
            });
        });
    }
}