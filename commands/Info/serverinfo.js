const Discord = require("discord.js");
const { stripIndent } = require('common-tags');

module.exports = {
    name: "serverinfo",
    aliases: ["server"],
    category: "Other",
    description: "Shows server stats",
    usage: "serverinfo\n**e.g.**\n\`serverinfo\`\n> Get some useful stat about this server",
    run: async (client, msg, arg) => {

        const filterLevels = {DISABLED: 'Off',MEMBERS_WITHOUT_ROLES: 'No Role',ALL_MEMBERS: 'Everyone',0: 'Off',1: 'No Role',2: 'Everyone'};
        const verificationLevels = {NONE: 'None', LOW: 'Low', MEDIUM: 'Medium', HIGH: 'High',VERY_HIGH: 'Highest',0: 'None',  1: 'Low', 2: 'Medium',3: 'High',4: 'Highest'};
        const tierLevels = {NONE: 'None', TIER_1: '1', TIER_2: '2', TIER_3: '3'};

        const channels = stripIndent`
            Text  :: ${msg.guild.channels.cache.filter(chan => chan.type === 'GUILD_TEXT').size}
            Voice :: ${msg.guild.channels.cache.filter(chan => chan.type === 'GUILD_VOICE').size}
        `;

        const boost = stripIndent`
            Count :: ${msg.guild.premiumSubscriptionCount || 0}
            Tier  :: ${tierLevels[msg.guild.premiumTier]}
        `;

        const members = stripIndent`
            Online :: ${await msg.guild.members.fetch().then(f => f.filter(m => m.presence !== "offline" && m.presence !== null).size)}
            Total  :: ${msg.guild.memberCount}
        `;

        const other = stripIndent`
            Owner              :: ${await msg.guild.fetchOwner().then(o => o.user.tag)}
            Created at         :: ${msg.guild.createdAt.toLocaleString()}
            Verification Level :: ${verificationLevels[msg.guild.verificationLevel]}
            Explicit Filter    :: ${filterLevels[msg.guild.explicitContentFilter]}
            Roles Count        :: ${msg.guild.roles.cache.size}
        `;

        const embed = new Discord.MessageEmbed()
            .setAuthor(msg.guild.name, msg.guild.iconURL())
            .setColor('RANDOM')
            .setThumbnail(msg.guild.iconURL())
            .addField(`Members`, `\`\`\`asciidoc\n${members}\`\`\``,true)
            .addField(`Channels`, `\`\`\`asciidoc\n${channels}\`\`\``,true)
            .addField(`Boost`, `\`\`\`asciidoc\n${boost}\`\`\``,true)
            .addField(`Other`, `\`\`\`asciidoc\n${other}\`\`\``,false)
            
        msg.channel.send({embeds:[embed]});
    }
}
