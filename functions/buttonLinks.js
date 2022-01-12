const Discord = require('discord.js');
const config = require('../config.json');
/**
 * @param {Object} interaction 
 * @param {MessageEmbed} embed 
 * @returns adds buttons to given embed
 */
module.exports = async function (interaction, embed) {
    const links = new Discord.MessageActionRow()
        .addComponents(
            new Discord.MessageButton()
                .setLabel('Invite')
                .setStyle('LINK')
                .setURL(config.bot_invite_link)
                .setEmoji('😃'),
            new Discord.MessageButton()
                .setLabel('Vote')
                .setStyle('LINK')
                .setURL(config.bot_vote_link)
                .setEmoji('💜'),
            new Discord.MessageButton()
                .setLabel('Github')
                .setStyle('LINK')
                .setURL(config.bot_project_link),
                // .setEmoji('🧬'),
            new Discord.MessageButton()
                .setLabel('Website')
                .setStyle('LINK')
                .setURL(config.bot_website_link)
                // .setEmoji('🔗'),
        );
    return interaction.reply({embeds:[embed],components:[links]});
}