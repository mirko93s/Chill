const Discord = require("discord.js");

module.exports = {
    name: "help",
    aliases: ["h"],
    category: "info",
    description: "Show help for a specific command",
    usage: "help [command | alias]\n**e.g.**\n\`help\`\n> shows a list with all the available commands\n\`help ping\`\n> shows help about the ping command and how to use it",
    run: async (client, msg, arg) => {

        if (arg[0]) {
            return getCMD(client, msg, arg[0]);
        } else {
            return getAll(client, msg);
        }
    }
}

function getAll(client, msg) {
    const helpembed = new Discord.MessageEmbed()
        .setTitle("❓ Chill Bot HELP ❓")
        .setDescription("Type .help <command | alias> for more info.")
        .setColor(0x00AE86)
        .setThumbnail(client.user.displayAvatarURL())
        /* Admin */.addField("🚫 Admin", "`addchannel` `broadcast` `giveaway` `poll` `serverstats` `setup`", true)
        /* Auto-Vocal*/.addField("🔊 Auto-Vocal", "`autovocal` `autovocallock` `autovocalinvite` `autovocalkick`", true)
        /* Bot */.addField("🤖 Bot", "`botinfo` `bugreport` `invite` `project` `vote` `website`", true)
        /* Commands */.addField("🛃 Commands", "`command` `customcommand` `customcommandremove` `customcommandlist`", true)
        /* Fun */.addField("🎲 Fun", "`8ball` `achievement` `coinflip` `connect4` `rockpaperscissors` `ship` `slotmachine`", true)
        /* Info */.addField("ℹ️ Info", "`avatar` `help` `serveremojis` `serverinfo` `whois`", true)
        /* Moderation */.addField("🔨 Moderation", "`ban` `kick` `mute` `purge` `report` `say` `ticket` `unmute`", true)
        /* Music */.addField("🎵 Music", "`play` `skip` `playskip` `pause` `resume` `stop` `nowplaying` `queue` `summon` `volume`", true)
        /* Other */.addField("💡 Other", "`calc` `instagram` `mcstat` `nick` `percentage` `ping` `remindme` `today` `urban` `weather`", true)
        /* Owner */.addField("⚙️ Owner", "`blast` `botactivity` `guilds`", true)
        /* Roles */.addField("🎚️ Roles", "`addrole` `removerole` `roleinfo` `rolelist`", true)
        /* Settings */.addField("💾 Settings", "`resetconfig` `setconfig` `showconfig`", true)
        /* Xp */.addField("🏆 Xp", "`leaderboard` `level` `rewards` `xp`", true)
        /* blank-field-to-keep-column-width-reserved-for-future-categories */.addField('\u200b', '\u200b', true)
        /* blank-field-to-keep-column-width-reserved-for-future-categories */.addField('\u200b', '\u200b', true)

    return msg.channel.send(helpembed);
}

function getCMD(client, msg, input) {
    const embed = new Discord.MessageEmbed()

    const cmd = client.commands.get(input.toLowerCase()) || client.commands.get(client.aliases.get(input.toLowerCase()));
    
    let info = `⛔ No information found for command **${input.toLowerCase()}**`;

    if (!cmd || cmd.debug) return msg.channel.send(embed.setColor("RED").setDescription(info)).then(msg => msg.delete({ timeout: 5000 }));

    //if (cmd.name) info = `**Command name**: ${cmd.name}`;
    if (cmd.aliases) info = `**Aliases**: ${cmd.aliases.map(a => `\`${a}\``).join(", ")}`;
    if (!cmd.aliases && cmd.description) info = `**Description**: ${cmd.description}`;
    else if (cmd.description) info += `\n**Description**: ${cmd.description}`;
    if (cmd.usage) {
        info += `\n**Usage**: ${cmd.usage}`;
        embed.setFooter(`Syntax: <> = required, [] = optional, | = or`);
    }
    if (cmd.permission) info += `\n\n**Permission**: \`\`\`${cmd.permission}\`\`\``;

    return msg.channel.send(embed.setColor("GREEN").setTitle(`**${cmd.name}**`).setDescription(info));
}