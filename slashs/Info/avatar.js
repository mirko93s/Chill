const Discord = require("discord.js");

module.exports = {
    name: "avatar",
    description: "Display user's Avatar (also available right-clicking someone)",
    options: [
        {
            name: 'user',
            description: 'User to get the avatar of',
            type: 'USER',
        },
    ],
    run: async (client, interaction, arg) => {
        getPfp(interaction, interaction.options.getMember('user') || interaction.member);
    }
}

module.exports.user = {
    name: "Avatar",
    type: 'USER',
    run: async (client, interaction, arg) => {
        getPfp(interaction, interaction.targetMember);        
    }
}

async function getPfp (interaction, user) {
    const avatarEmbed = new Discord.MessageEmbed()
            .setColor(`RANDOM`)
            .setTitle(`${user.user.username}'s avatar`)
            .setImage(user.displayAvatarURL({size: 4096, dynamic: true}))
            .setURL(user.displayAvatarURL({size: 4096, dynamic: true}))
        interaction.reply({embeds:[avatarEmbed]});
}