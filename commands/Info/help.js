const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "help",
    aliases: ["h"],
    category: "info",
    description: "Show help for a specific command",
    usage: "help [command | alias]\n**e.g.**\n\`help\`\n> shows a list with all the available commands\n\`help ping\`\n> shows help about the ping command and how to use it",
    run: async (client, msg, arg) => {
        if (client.settings.get(msg.guild.id, "autodeletecmds") === "true") msg.delete();
        if (arg[0]) {
            return getCMD(client, msg, arg[0]);
        } else {
            return getAll(client, msg);
        }
    }
}

function getAll(client, msg) {
    const helpembed = new MessageEmbed()
        .setTitle(":question: Chill Bot HELP :question:")
        .setDescription("Type .help <command | alias> for more info.")
        .setColor(0x00AE86)
        .setThumbnail(client.user.displayAvatarURL())
        /* Admin */.addField(":no_entry_sign: Admin", "`addchannel` `broadcast` `giveaway` `poll` `setup`")
        /* Bot */.addField(":robot: Bot", "`botinfo` `bugreport` `invite` `project` `vote` `website`")
        /* Fun */.addField(":game_die: Fun", "`8ball` `achievement` `coinflip` `rockpaperscissors` `ship` `slotmachine`")
        /* Info */.addField(":information_source: Info", "`avatar` `help` `serveremojis` `serverinfo` `whois`")
        /* Moderation */.addField(":hammer: Moderation", "`ban` `kick` `mute` `purge` `report` `say` `ticket` `unmute`")
        /* Music */.addField(":musical_note: Music", "`musicchannelonly` `play` `skip` `playskip` `pause` `resume` `stop` `nowplaying` `queue` `summon` `volume`")
        /* Other */.addField(":bulb: Other", "`calc`, `instagram` `mcstat` `nick` `percentage` `ping` `remindme` `today` `urban` `weather`")
        /* Owner */.addField(":gear: Owner", "`blast` `botactivity` `guilds`")
        /* Roles */.addField(":level_slider: Roles", "`addrole` `removerole` `roleinfo` `rolelist`")
        /* Settings */.addField(":floppy_disk: Settings", "`resetconfig` `setconfig` `showconfig`")
        /* Xp */.addField(":trophy: Xp", "`leaderboard` `level` `xp`")

    return msg.channel.send(helpembed);
}

function getCMD(client, msg, input) {
    const embed = new MessageEmbed()

    const cmd = client.commands.get(input.toLowerCase()) || client.commands.get(client.aliases.get(input.toLowerCase()));
    
    let info = `⛔ No information found for command **${input.toLowerCase()}**`;

    if (!cmd) {
        return msg.channel.send(embed.setColor("RED").setDescription(info)).then(msg => msg.delete({ timeout: 5000 }));
    }

    //if (cmd.name) info = `**Command name**: ${cmd.name}`;
    if (cmd.aliases) info = `**Aliases**: ${cmd.aliases.map(a => `\`${a}\``).join(", ")}`;
    if (!cmd.aliases && cmd.description) info = `**Description**: ${cmd.description}`;
    else info += `\n**Description**: ${cmd.description}`;
    if (cmd.usage) {
        info += `\n**Usage**: ${cmd.usage}`;
        embed.setFooter(`Syntax: <> = required, [] = optional, | = or`);
    }
    if (cmd.permission) info += `\n\n**Permission**: \`\`\`${cmd.permission}\`\`\``;

    return msg.channel.send(embed.setColor("GREEN").setTitle(`**${cmd.name}**`).setDescription(info));
}