const Discord = require("discord.js");

module.exports = {
    name: "help",
    description: "Show command list or check a specific command",
    options: [
        {
            name: 'command',
            description: 'Which command to get info about',
            type: 'STRING',
        },
    ],
    run: async (client, interaction, arg) => {

        if (interaction.options.getString('command')) {
            return getCMD(client, interaction, interaction.options.getString('command'));
        } else {
            return getAll(client, interaction);
        }
    }
}

function getAll(client, interaction) {
    const helpembed = new Discord.MessageEmbed()
        .setTitle("❓ Chill Bot HELP ❓")
        .setDescription(`Type ${client.settings.get(interaction.guild.id,'prefix')}help <command | alias> for more info.`)
        .setColor(0x00AE86)
        .setThumbnail(client.user.displayAvatarURL())
        /* Admin */.addField("🚫 Admin", "`announce` `channel` `drop` `giveaway` `poll` `reactionrole` `usercounter`", true)
        /* Auto-Vocal*/.addField("🔊 Auto-Vocal", "`autovocal` `autovocal_create`", true)
        /* Bot */.addField("🤖 Bot", "`bot` `bug`", true)
        /* Commands */.addField("🛃 Commands", "`command` `customcommand` `customcommandlist`", true)
        /* Fun */.addField("🎲 Fun", "`8ball` `achievement` `activity` `coinflip` `connect4` `rockpaperscissors` `ship` `slotmachine`", true)
        /* Info */.addField("ℹ️ Info", "`avatar` `help` `serveremojis` `serverinfo` `userinfo`", true)
        /* Moderation */.addField("🔨 Moderation", "`ban` `clear` `kick` `report` `say` `slowmode` `ticket` `timeout`", true)
        /* Music */.addField("🎵 Music", "`play` `skip` `pause` `resume` `stop` `nowplaying` `queue` `summon` `volume`", true)
        /* Other */.addField("💡 Other", "`calc` `instagram` `mcstat` `nick` `percentage` `ping` `remindme` `today` `urban` `weather`", true)
        /* Owner */.addField("⚙️ Owner", "`blast` `botactivity` `cmdstats` `guilds`", true)
        /* Roles */.addField("🎚️ Roles", "`roleinfo` `rolelist` `userrole`", true)
        /* Settings */.addField("💾 Settings", "`resetconfig` `setconfig` `setup` `showconfig`", true)
        /* Xp */.addField("🏆 Xp", "`leaderboard` `level` `rewards` `xp`", true)
        /* blank-field-to-keep-column-width-reserved-for-future-categories */.addField('\u200b', '\u200b', true)
        /* blank-field-to-keep-column-width-reserved-for-future-categories */.addField('\u200b', '\u200b', true)

    return client.chill.buttonLinks(interaction, helpembed);
}

function getCMD(client, interaction, input) {
    const embed = new Discord.MessageEmbed()

    const cmd = client.slashs.get(input.toLowerCase());

    if (!cmd || cmd.debug) return interaction.reply({ephemeral:true, embeds:[embed.setColor("RED").setDescription(`⛔ No information found for command **${input.length>128?input.toLowerCase().substring(0,128)+'...':input.toLowerCase()}**`)]});

    embed.setDescription (`\n**Description**\n> ${cmd.description}`);
    if (cmd.usage) embed.description += `\n**Info**\n> ${cmd.usage}`;
    if (cmd.userPerms) embed.description += `\n\n**Permissions**\n> \`${cmd.userPerms.join('`, `')}\``;

    return interaction.reply({embeds:[embed.setColor("GREEN").setTitle(`**${cmd.name}**`)]});
}