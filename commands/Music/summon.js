const Discord = require("discord.js");
const { joinVoiceChannel } = require ('@discordjs/voice');

module.exports = {
    name: "summon",
    category: "Music",
    description: "Summon the bot in your voice channel",
    usage: "summon\n**e.g.**\n\`summon\`\n> moves or connects the Bot to the voice channel you are currently in",
    run: async (client, msg, arg) => {

        const noDJroleEmbed = new Discord.MessageEmbed()
            .setColor('PURPLE')
            .setTitle(":musical_note: Music")
            .setDescription(`⛔ You don't have DJ role`)
        const notinvcEmbed = new Discord.MessageEmbed()
            .setColor('PURPLE')
            .setTitle(":musical_note: Music")
            .setDescription(`⛔ You are not in a voice channel`)
        const mconlyEmbed = new Discord.MessageEmbed()
            .setColor(`RANDOM`)
            .setTitle(":musical_note: Music")
            .setDescription(`Music Channel Only is active!\nYou can only use the music module in: <#${client.settings.get(msg.guild.id, "musictextchannel")}>`)

        if (msg.member.roles.cache.some(role => role.id === (client.settings.get(msg.guild.id, "djrole")))) {
            if (client.settings.get(msg.guild.id, "musicchannelonly") === "true" && msg.channel.id !== client.settings.get(msg.guild.id, "musictextchannel")) return msg.channel.send({embeds:[mconlyEmbed]}).then(msg =>setTimeout(() => msg.delete(), 10e3));
            if (!msg.member.voice.channel) return msg.channel.send({embeds:[notinvcEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5e3));

            await joinVoiceChannel({
                channelId: msg.member.voice.channel.id,
                guildId: msg.member.voice.channel.guild.id,
                adapterCreator: msg.member.voice.channel.guild.voiceAdapterCreator,
            });
            
        } else return msg.channel.send({embeds:[noDJroleEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5e3));
    }
}
