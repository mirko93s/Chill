const Discord = require("discord.js");

module.exports = {
    name: "musicchannelonly",
    aliases: ["mconly","mco"],
    category: "Music",
    description: "Limit Music module only to music channel",
    usage: "musicchannelonly <true/false>\n**e.g**\n\`musicchannelonly true\`\n> will enable the Music Channel Only mode (default: false)\n> While active Music commands can only be used in the preset Music Text Channel and the \"summon\" command will be disabled\n> Keep in mind, the music text channel is only shown when you are connected in the music voice channel",
    permission: "ADMINISTRATOR",
    run: async (client, msg, arg) => {
        msg.delete();

        const nopermEmbed = new Discord.RichEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ You don't have permission to use this!`)

        const resultEmbed = new Discord.RichEmbed()
            .setColor(`RANDOM`)
            .setTitle(":musical_note: Music")
            .setDescription(`Music Channel Only: \`${arg[0]}\``)

        const wrongvalueEmbed = new Discord.RichEmbed()
            .setColor(`RANDOM`)
            .setTitle(":musical_note: Music")
            .setDescription(`You can only set this value to \`true\` or  \`false\``)

        if (!msg.member.hasPermission("ADMINISTRATOR")) return msg.reply(nopermEmbed).then(msg => msg.delete(5000));

        if (arg[0] === "true" || arg[0] === "false") {
            client.settings.set(msg.guild.id, arg[0], "musicchannelonly");
            msg.channel.send(resultEmbed).then(msg => msg.delete(5000));
        }
        else return msg.channel.send(wrongvalueEmbed).then(msg => msg.delete(5000));
    }
}
