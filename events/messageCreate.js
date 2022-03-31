const talkedRecently = new Set();

module.exports = async (client, msg) => {
	const LANG = client.lang(msg.guild.preferredLocale, `events`, `messageCreate`);
	if (!msg.guild || msg.author.bot) return;
	prefix = client.settings.get(msg.guild.id, `prefix`);
	// mention bot
	if (msg.mentions.has(client.user) && !msg.content.includes(`@here`) && !msg.content.includes(`@everyone`)) msg.reply(LANG.bot_mention(msg.author));
	// xp
	if (client.settings.get(msg.guild.id, `xpmodule`) === `true` && msg.guild && !msg.content.startsWith(prefix) && !talkedRecently.has(msg.author.id) && msg.channel.id !== client.settings.get(msg.guild.id, `musictextchannel`)) {
		client.chill.xpAdd(client, msg, talkedRecently);
	}
	// old main
	if (!msg.content.startsWith(prefix)) return;
	// commands stuff
	const arg = msg.content.slice(prefix.length).trim().split(/ +/g);
	const cmd = arg.shift().toLowerCase();
	// command handler
	if (cmd.length === 0) return;
	let command = client.commands.get(cmd);
	if (!command) command = client.commands.get(client.aliases.get(cmd));
	if (command) {
		client.cmdstats.inc(`usage`, command.name);
		if (client.settings.includes(msg.guild.id, command.name, `disabledcommands`)) return msg.channel.send({ embeds: [client.chill.error(LANG.guild_disabled(command))] }).then(m => setTimeout(() => m.delete(), 5000)); // check if command is disabled on the guild
		if (client.settings.get(msg.guild.id, `autodeletecmds`) === `true`) msg.delete();
		command.run(client, msg, arg);
	} else { // custom command loader
		client.chill.checkCustomCommand(client, msg, cmd);
	}
};