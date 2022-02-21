const Discord = require("discord.js");

module.exports = {
    name: "serveremojis",
    description: "Returns a list with all the emojis in this server",
    options: null,
    run: async (client, interaction, arg) => {

        const noemojiEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Server has no emojis`)
        const emojiEmbed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTitle('Server Emojis')

        let emojis = await interaction.guild.emojis.cache.map((e) => `${e}`).join(' ').toString();
        if (emojis.length < 1) return interaction.reply({ephemeral:true, embeds:[noemojiEmbed]});
        else if (emojis.length > 4096) {
            emojis = emojis.slice(0, 4096).split(' ');
            if (!emojis[emojis.length-1].endsWith('>')) emojis = emojis.splice(0, emojis.length-1).join(' ');
            embed.setFooter({text:'Some emojis are missing in this list due to Discord 4096 characters limit.'})
        }
        embed.setDescription(emojis.replace(/\s/g,''));
        interaction.reply({embeds:[emojiEmbed]});
    }
}
