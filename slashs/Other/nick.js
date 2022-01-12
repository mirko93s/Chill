const Discord = require("discord.js");

module.exports = {
    name: "nickname",
    description: "Change users's nicknames",
    botPerms: ['MANAGE_NICKNAMES'],
    userPerms: ['MANAGE_NICKNAMES'],
    options: [
        {
            name: "user",
            description: "User to chnage the nick to",
            type: 'USER',
            required: true,
        },
        {
            name: "nick",
            description: "New nickname, max 32 characters",
            type: 'STRING',
            required: true,
        },

    ],
    run: async (client, interaction, arg) => {

        const hierarchyEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ I can't change that member's nickname due to role hierarchy`)
        const nomemberEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Couldn't find that member`)

        const user = interaction.options.getMember('user');
        if (!user) return interaction.reply({ephemeral:true, embeds:[nomemberEmbed]});

        if (user.roles.highest.position > interaction.guild.me.roles.highest.position || user.id === interaction.guild.ownerId)
        return interaction.reply({ephemeral:true, embeds:[hierarchyEmbed]});

        let newnickname = interaction.options.getString('nick').substring(0,32);
        interaction.guild.members.cache.get(user.user.id).setNickname(newnickname);
        const embed = new Discord.MessageEmbed()
            .setColor(`RANDOM`)
            .addField("Username set successfully!", newnickname + " is now the nickname for " + user.user.username + " :white_check_mark:");

        return interaction.reply({embeds:[embed]});
    }
}