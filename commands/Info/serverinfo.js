const Discord = require("discord.js");
const { stripIndent } = require('common-tags');

module.exports = {
    name: "serverinfo",
    aliases: ["server"],
    category: "Other",
    description: "Shows server stats",
    usage: "serverinfo\n**e.g.**\n\`serverinfo\`\n> Get some useful stat about this server",
    run: async (client, msg, arg) => {
        msg.delete();

        const filterLevels = {DISABLED: 'Off',MEMBERS_WITHOUT_ROLES: 'No Role',ALL_MEMBERS: 'Everyone',0: 'Off',1: 'No Role',2: 'Everyone'};
        const verificationLevels = {NONE: 'None', LOW: 'Low', MEDIUM: 'Medium', HIGH: 'High',VERY_HIGH: 'Highest',0: 'None',  1: 'Low', 2: 'Medium',3: 'High',4: 'Highest'};

        const channels = stripIndent`
            Text  :: ${msg.guild.channels.filter(chan => chan.type === 'text').size}
            Voice :: ${msg.guild.channels.filter(chan => chan.type === 'voice').size}
        `;

        const boost = stripIndent`
            Count :: ${msg.guild.premiumSubscriptionCount || 0}
            Tier  :: ${msg.guild.premiumTier ? `Tier ${msg.guild.premiumTier}` : 'None'}
        `;

        const members = stripIndent`
            Online :: ${msg.guild.members.filter(m => m.presence.status != 'offline').size}
            Total  :: ${msg.guild.memberCount}
        `;

        const other = stripIndent`
            Owner              :: ${msg.guild.owner.user.tag}
            Created at         :: ${msg.guild.createdAt.toLocaleString()}
            Region             :: ${msg.guild.region}
            Verification Level :: ${verificationLevels[msg.guild.verificationLevel]}
            Explicit Filter    :: ${filterLevels[msg.guild.explicitContentFilter]}
            Roles Count        :: ${msg.guild.roles.size}
        `;

        const embed = new Discord.RichEmbed()
            .setAuthor(msg.guild.name, msg.guild.iconURL)
            .setColor('RANDOM')
            .setThumbnail(msg.guild.iconURL)
            .addField(`Members`, `\`\`\`asciidoc\n${members}\`\`\``,true)
            .addField(`Channels`, `\`\`\`asciidoc\n${channels}\`\`\``,true)
            .addField(`Boost`, `\`\`\`asciidoc\n${boost}\`\`\``,true)
            .addField(`Other`, `\`\`\`asciidoc\n${other}\`\`\``,false)
        msg.channel.send(embed).then(msg => msg.delete(30000));
    }
}
