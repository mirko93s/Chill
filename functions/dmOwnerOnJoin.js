const Discord = require(`discord.js`);
/**
 *
 * @param {Client} client
 * @param {Object} guild
 */
module.exports = function(client, guild) {
	const dmonweronjoinEmbed = new Discord.EmbedBuilder()
		.setColor(`Random`)
		.setAuthor({ name: `Chill - Discord Bot` })
		.setURL(`https://www.mirko93s.it/`)
		.setThumbnail(client.user.displayAvatarURL())
		.setTitle(`Thanks for inviting my bot! 💜`)
		.setDescription(`⚠️ Follow the instructions to setup the Bot (Don't skip them!) ⚠️
        \n1️⃣ **Type /showconfig** \n> You can check the default settings in there.
        \n2️⃣ **Rename channels and roles**\n > Rename the channels and the roles you see in the config as you prefer, they are saved in the config using their id, so you can rename them at any time and they will still be linked to the config.
        \n3️⃣ **Other settings**\n> Check and set **Other** and **Toggles** sections as you prefer, you can disable features you don't want such xp system, welcome messages and more. If you want to get back to default, type /resetconfig.
        \n4️⃣ **Set your role hierarchy**\n> **Chill** (bot) role must be just below the owner/admin role.
        \n7️⃣ **Deleted Config Keys**\n> If you accidentally delete a bot's channel or role it will appear as "NOT FOUND" in /showconfig, to fix and create the missing keys of the config type /setup. This will create the missing/deleted channels and roles, or use /setconfig to manually link an existing channel/role to the config.
        \n
        \n**TL;DR**\n> You can now rename all the channels and roles the bot has just created, check them by doing /showconfig. Do /setup if you accidentally deleted a bot's channel/role.
        \n
        \n*P.S. You can use the same channel/role for multiple scopes using /setconfig*
        `)
		.setFooter({ text: `©️ 2019-2022 mirko93s#4389`, iconURL: client.user.displayAvatarURL() });
	guild.fetchOwner().then(owner => {
		owner.send({ embeds: [dmonweronjoinEmbed] }).catch(err => {
			return;
		});
	});
};