const Discord = require("discord.js");
const { stripIndent } = require('common-tags');

module.exports = {
    name: "drop",
    category: "Admin",
    description: "Host a drop",
    usage: "drop <prize>\n**e.g.**\n\`drop 1 month Discord Nitro\`\n> First user to click wins the drop",
    permission: "MANAGE_GUILD",
    run: async (client, msg, arg) => {
    
        const nopermEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ You don't have permission to use this!`)
        const nochannelEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Giveaway channel not found!`)
        const noprizeEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Please provide a valid prize for the Drop`)
        
        if(!msg.guild.members.cache.get(msg.author.id).permissions.has('MANAGE_GUILD')) return msg.channel.send({embeds:[nopermEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5e3));
        let gachannel = msg.guild.channels.cache.find(gachannel => gachannel.id === (client.settings.get(msg.guild.id, "gachannel")));
        if(!gachannel) return msg.channel.send({embeds:[nochannelEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5e3));

        const prize = arg.join(' ');
        if (!prize || prize.length > 3072) return msg.channel.send({embeds:[noprizeEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5e3));

        const dropEmbed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTitle('🎁 Drop')
            .setDescription(`**Prize:** ${prize}`)
            .setFooter('Click the button below to Claim the Drop')

        const claimbutton = new Discord.MessageButton()
            .setCustomId('claim')
            .setLabel('Claim')
            .setStyle('PRIMARY')
        let buttonrow = new Discord.MessageActionRow().addComponents(claimbutton)

        msg.channel.send({embeds:[dropEmbed], components:[buttonrow]}).then(sent => {
            const filter = (interaction) => {
                interaction.deferUpdate();
                if (!interaction.user.bot) return true;
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