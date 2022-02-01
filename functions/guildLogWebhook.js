const { stripIndent } = require("common-tags");
const Discord = require("discord.js");
const config = require('../config.json');
/**
 * 
 * @param {Client} client 
 * @param {Object} guild 
 * @param {Boolean} join 
 */
module.exports = async function (client, guild, join) {
    const webhook = new Discord.WebhookClient({url: config.guild_log_webhook_link})
    await webhook.edit({name:guild.name});
    const webhookEmbed = new Discord.MessageEmbed()
        .setColor(join === true ? 'GREEN' : 'RED')
        .setTitle(`${join === true ? 'Joined' : 'Left'} ・ \`${client.guilds.cache.size}\``)
        .setDescription(stripIndent`
        \`\`\`asciidoc
        Members :: ${guild.memberCount}
        Owner   :: ${await guild.fetchOwner().then(o => o.user.tag)}
        Id      :: ${guild.id}
        \`\`\`
        `)
    webhook.send({embeds:[webhookEmbed]});
}