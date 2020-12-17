const Discord = require("discord.js");

module.exports = {
    name: "summon",
    category: "Music",
    description: "Summon the bot in your voice channel",
    usage: "summon\n**e.g.**\n\`summon\`\n> moves or connects the Bot to the voice channel you are currently in",
    run: async (client, msg, arg) => {
        if (client.settings.get(msg.guild.id, "autodeletecmds") === "true") msg.delete();

        const noDJroleEmbed = new Discord.MessageEmbed()
            .setColor('PURPLE')
            .setTitle(":musical_note: Music")
            .setDescription(`⛔ You don't have DJ role`)
        const notinvcEmbed = new Discord.MessageEmbed()
            .setColor('PURPLE')
            .setTitle(":musical_note: Music")
            .setDescription(`⛔ You are not in a voice channel`)
        const nosummonEmbed = new Discord.MessageEmbed()
            .setColor(`RANDOM`)
            .setTitle(":musical_note: Music")
            .setDescription(`Music Channel Only is active! \`summon\` command is disabled`)
            .setFooter(`You can only use the music module in: ${client.settings.get(msg.guild.id, "musicvocalchannel")}`)

        if (msg.member.roles.cache.some(role => role.name === (client.settings.get(msg.guild.id, "djrole")))) {
            if (client.settings.get(msg.guild.id, "musicchannelonly") === "true") return msg.channel.send(nosummonEmbed).then(msg => msg.delete({ timeout: 5000 }));
            if (!msg.member.voice.channel) return msg.channel.send(notinvcEmbed).then(msg => msg.delete({ timeout: 5000 }));
            msg.member.voice.channel.join();
        } else return msg.channel.send(noDJroleEmbed).then(msg => msg.delete({ timeout: 5000 }));
    }
}
