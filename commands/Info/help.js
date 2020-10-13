const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");

module.exports = {
    name: "help",
    aliases: ["h"],
    category: "info",
    description: "Show help for a specific command",
    usage: "help [command | alias]\n**e.g.**\n\`help\`\n> shows a list with all the available commands\n\`help ping\`\n> shows help about the ping command and how to use it",
    run: async (client, message, args) => {
        message.delete();
        if (args[0]) {
            return getCMD(client, message, args[0]);
        } else {
            return getAll(client, message);
        }
    }
}

function getAll(client, message) { //old help main page below-----------
    // const embed = new RichEmbed()
    //     .setColor("RANDOM")

    // const commands = (category) => {
    //     return client.commands
    //         .filter(cmd => cmd.category === category)
    //         .map(cmd => `- \`${cmd.name}\``)
    //         .join("\n");
    // }

    // const info = client.categories
    //     .map(cat => stripIndents`**${cat[0].toUpperCase() + cat.slice(1)}** \n${commands(cat)}`)
    //     .reduce((string, category) => string + "\n" + category);

        const helpembed = new RichEmbed()
            .setTitle(":question: Chill Bot HELP :question:")
            .setDescription("Type .help <command | alias> for more info.")
            .setColor(0x00AE86)
            .setThumbnail(client.user.displayAvatarURL)
            /* Admin */.addField(":no_entry_sign: Admin", "addchannel, broadcast, giveaway, poll, setup")
            /* Bot */.addField(":robot: Bot", "botinfo, bugreport, invite, project, website")
            /* Fun */.addField(":game_die: Fun", "8ball, flipcoin, respawn, rockpaperscissors, ship, slotmachine, wouldyourather")
            /* Info */.addField(":information_source: Info", "avatar, help, serveremojis, serverinfo, whois")
            /* Moderation */.addField(":hammer: Moderation", "ban, kick, mute, purge, report, say, ticket, unmute")
            /* Music */.addField(":musical_note: Music", "play, skip, playskip, pause, resume, stop, nowplaying, queue, summon, volume")
            /* Other */.addField(":bulb: Other", "calc, instagram, mcstat, nick, percentage, ping, today, translator, urban, weather")
            /* Owner */.addField(":gear: Owner", "botactivity")
            /* Roles */.addField(":level_slider: Roles", "addrole, removerole, roleinfo, rolelist")
            /* Settings */.addField(":floppy_disk: Settings", "resetconfig, setconfig, showconfig")
            /* Xp */.addField(":trophy: Xp", "leaderboard, level, xp")

    return message.channel.send(helpembed);
}

function getCMD(client, message, input) {
    const embed = new RichEmbed()

    const cmd = client.commands.get(input.toLowerCase()) || client.commands.get(client.aliases.get(input.toLowerCase()));
    
    let info = `⛔ No information found for command **${input.toLowerCase()}**`;

    if (!cmd) {
        return message.channel.send(embed.setColor("RED").setDescription(info)).then(msg => msg.delete(5000));
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

    return message.channel.send(embed.setColor("GREEN").setTitle(`**${cmd.name}**`).setDescription(info));
}