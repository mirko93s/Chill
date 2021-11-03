const Discord = require('discord.js')
/**
 * 
 * @param {Client} client 
 * @param {Object} guild 
 */
module.exports = function(client, guild) {
    const dmonweronjoinEmbed = new Discord.MessageEmbed()
        .setColor(`RANDOM`)
        .setAuthor(`Chill - Discord Bot`)
        .setURL(`https://www.mirko93s.it/`)
        .setThumbnail(client.user.avatarURL())
        .setTitle(`Thanks for inviting my bot!`)
        .setDescription(`⚠️ Follow the instructions to setup the Bot (Don't skip them!) ⚠️
        \n1️⃣ **Type .showconfig** \n> You can check the default settings in there.
        \n2️⃣ **Rename channels and roles**\n > Rename the channels and the roles you see in the config as you prefer, they are saved in the config using their id, so you can rename them at any time and they will still be linked to the config.
        \n3️⃣ **Other settings**\n> Check and set **Other** and **Toggles** sections as you prefer, you can disable features you don't want such xp system, welcome messages and more. If you want to get back to default, type .resetconfig.
        \n4️⃣ **Set your role hierarchy**\n> **Chill** (bot) role must be just below the owner/admin role.\n> **Muted** role must be above any other role that your members will get.
        \n5️⃣ **Music**\n> Don't forget to give **DJ** role to your members to make sure they can use Music commands.\n> If you will use "Music Only Channel" a hidden text channel will only be shown to people who are connected to the Music Vocal Channel and music commands will only work on the "Music Text Channel".
        \n6️⃣ **Mute command**\n> You might need to adjust channel permissions to avoid that "Muted" members can still send messages, depending on how your server has been set.
        \n7️⃣ **Deleted Config Keys**\n> If you accidentally delete a bot's channel or role it will appear as "NOT FOUND" in .showconfig, to fix and create the missing keys of the config type .setup. This will create the missing/deleted channels and roles, or use .setconfig to manually link and existing channel/role to the config.
        \n
        \n**TL;DR**\n> You can now rename all the channels and roles the bot has just created, check them by doing .showconfig. Put Muted role above any other role that normal members can get, give DJ role to users. Do .setup if you accidentally deleted a bot's channel/role.
        \n
        \n*P.S. If you wish to use the same channel/role for multiple scopes use .setconfig*
        `)
        .setFooter(`©️ 2019-2021 mirko93s`,`https://cdn.discordapp.com/avatars/278380909588381698/029d0578df3fa298132b3d85dd06bf3c.png?size=128`)
    guild.fetchOwner().then(o => {
        try {
            o.send({embeds:[dmonweronjoinEmbed]});
        } catch (error) {
            return;
        }
    });
}