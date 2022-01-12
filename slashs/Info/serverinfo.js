const Discord = require("discord.js");
const { stripIndent } = require('common-tags');

module.exports = {
    name: "serverinfo",
    description: "Shows some server statistics",
    options: null,
    run: async (client, interaction, arg) => {

        const filterLevels = {DISABLED: 'Off',MEMBERS_WITHOUT_ROLES: 'No Role',ALL_MEMBERS: 'Everyone',0: 'Off',1: 'No Role',2: 'Everyone'};
        const verificationLevels = {NONE: 'None', LOW: 'Low', MEDIUM: 'Medium', HIGH: 'High',VERY_HIGH: 'Highest',0: 'None',  1: 'Low', 2: 'Medium',3: 'High',4: 'Highest'};
        const tierLevels = {NONE: 'None', TIER_1: '1', TIER_2: '2', TIER_3: '3'};

        const channels = stripIndent`
            Text  :: ${interaction.guild.channels.cache.filter(chan => chan.type === 'GUILD_TEXT').size}
            Voice :: ${interaction.guild.channels.cache.filter(chan => chan.type === 'GUILD_VOICE').size}
        `;

        const boost = stripIndent`
            Count :: ${interaction.guild.premiumSubscriptionCount || 0}
            Tier  :: ${tierLevels[interaction.guild.premiumTier]}
        `;

        const members = stripIndent`
            Online :: ${await interaction.guild.members.fetch().then(f => f.filter(m => m.presence !== "offline" && m.presence !== null).size)}
            Total  :: ${interaction.guild.memberCount}
        `;

        const other = stripIndent`
            Owner              :: ${await interaction.guild.fetchOwner().then(o => o.user.tag)}
            Created at         :: ${interaction.guild.createdAt.toLocaleString()}
            Verification Level :: ${verificationLevels[interaction.guild.verificationLevel]}
            Explicit Filter    :: ${filterLevels[interaction.guild.explicitContentFilter]}
            Roles Count        :: ${interaction.guild.roles.cache.size}
        `;

        const embed = new Discord.MessageEmbed()
            .setAuthor({name: interaction.guild.name, iconURL: interaction.guild.iconURL()})
            .setColor('RANDOM')
            .setThumbnail(interaction.guild.iconURL())
            .addField(`Members`, `\`\`\`asciidoc\n${members}\`\`\``,true)
            .addField(`Channels`, `\`\`\`asciidoc\n${channels}\`\`\``,true)
            .addField(`Boost`, `\`\`\`asciidoc\n${boost}\`\`\``,true)
            .addField(`Other`, `\`\`\`asciidoc\n${other}\`\`\``,false)
            
        interaction.reply({embeds:[embed]});
    }
}
