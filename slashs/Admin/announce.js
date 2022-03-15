const Discord = require("discord.js");

module.exports = {
    name: "announce",
    description: "Announce a message mentioning @everyone in the server",
    userPerms: ['ADMINISTRATOR'],
    botPerms: ['VIEW_CHANNEL','SEND_MESSAGES','EMBED_LINKS'],
    options: [
        {
            name: 'title',
            description: 'Announcement title, max 256 characters',
            type: 'STRING',
            required: true,
        },
        {
            name: 'description',
            description: 'Announcement description, max 2048 characters',
            type: 'STRING',
            required: true,
        },
        {
            name: 'channel',
            description: 'Channel to send the announcement in. If blank defaults to Guild Config Broadcast channel',
            type: 'CHANNEL',
            channelTypes: ['GUILD_TEXT','GUILD_NEWS'],
        },
    ],
    run: async (client, interaction, arg) => {

        const nobotpermEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ I don't have permission to do this! Please check my permissions.`)
        const nochannelEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Broadcast channel not found!`)
        const tooLongEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Please respect max lengths for title (256) and description (2048)`)

        const title = interaction.options.getString('title');
        const description = interaction.options.getString('description');
        if (title.length > 256 || description.length > 4096) return interaction.reply({ephemeral:true, embeds:[tooLongEmbed]});

        try {//send broadcast
            let bcEmbed = new Discord.MessageEmbed()
                .setTitle(title)
                .setDescription(description)
                .setColor("#00ff00")
                .setAuthor({name: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
            const bcchannel = interaction.options.getChannel('channel') || interaction.guild.channels.cache.find(bcchannel => bcchannel.id === (client.settings.get(interaction.guild.id, "bcchannel")));
            if(!bcchannel) return interaction.reply({ephemeral:true, embeds:[nochannelEmbed]});
            bcchannel.send("@everyone");
            bcchannel.send({embeds:[bcEmbed]});
            const sentEmbed = new Discord.MessageEmbed()
            .setColor(`GREEN`)
            .setDescription(`✅ Announcement correctly sent in ${bcchannel}`)
            interaction.reply({ephemeral:true, embeds:[sentEmbed]});
        } catch(err) {//bot no perm error
            interaction.reply({ephemeral:true, embeds:[nobotpermEmbed]});
            return console.log(err);
        }
    }
}
