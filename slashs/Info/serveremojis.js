const Discord = require("discord.js");

module.exports = {
    name: "serveremojis",
    description: "Returns a list with all the emojis in this server",
    options: null,
    run: async (client, interaction, arg) => {

        const noemojiEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Server has no emojis`)

        const emojis = await interaction.guild.emojis.cache.map((e) => `${e}`).join(' ').toString();
        if (emojis.length < 1) return interaction.reply({ephemeral:true, embeds:[noemojiEmbed]});

        const embed = new Discord.MessageEmbed()
            .setDescription(`Server Emojis:\n${emojis}`)
        interaction.reply({embeds:[embed]});
    }
}
