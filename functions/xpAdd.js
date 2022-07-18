const Discord = require(`discord.js`);
/**
 * @param {Client} client
 * @param {Object} msg
 * @param {Set} talkedRecently
 * @description Adds xp at each message sent by user with cooldown
 */
module.exports = function(client, msg, talkedRecently) {
	const LANG = client.lang(msg.guild.preferredLocale, `functions`, `xpAdd`);
	client.settings.ensure(msg.guild.id, { level: 0, points: 0 }, `xp.${msg.author.id}`);
	client.settings.inc(msg.guild.id, `xp.${msg.author.id}.points`);
	const curLevel = Math.floor(0.3163 * Math.sqrt(client.settings.get(msg.guild.id, `xp.${msg.author.id}.points`)));
	if (client.settings.get(msg.guild.id, `xp.${msg.author.id}.level`) < curLevel) { // level up
		client.settings.set(msg.guild.id, curLevel, `xp.${msg.author.id}.level`);
		const newlevelembed = new Discord.EmbedBuilder()
			.setColor(`Random`)
			.setAuthor({ name: LANG.congratulations, iconURL: msg.author.displayAvatarURL() })
			.setDescription(LANG.description(msg.member.user, curLevel));
		// check rewards
		const rewards = client.settings.get(msg.guild.id, `rewards`);
		let unlocked = ``;
		for (const [key, value] of Object.entries(rewards)) {
			if (value == curLevel) {
				const checkrole = msg.guild.roles.cache.find(r => r.id === key); // check if role exists
				if (checkrole && msg.guild.members.me.roles.highest.position > checkrole.rawPosition) msg.member.roles.add(checkrole.id); // give role
				unlocked += `${msg.guild.roles.cache.find(r => r.id === key).name}\n`;
			}
		};
		if (unlocked.length > 0) newlevelembed.setDescription(LANG.rewards(msg.member.user, curLevel, unlocked));
		msg.channel.send({ embeds: [newlevelembed] });
	};
	talkedRecently.add(msg.author.id); // xp cooldown
	setTimeout(() => {
		talkedRecently.delete(msg.author.id);
	}, client.settings.get(msg.guild.id, `xpcooldown`) * 1e3);
};