const Discord = require("discord.js");

module.exports = {
    name: "setconfig",
    category: "Settings",
    description: "Change a config's value",
    usage: "setconfig <key> <value>\n**e.g.**\n\`setconfig prefix ?\`\n> will set the prefix to \"?\"\n\`setconfig mutedrole icantspeak\`\n> change the mutedrole name to \"icantspeak\"\n> If you set the value of a channel or a role the Bot will also try to rename it.\n> If it doesn't succeed, the channel/role doesn't exist yet or you had manually renamed it\n> Run setup command to fix the missing channels/roles \n> Check showconfig command for a key and value list",
    permission: "ADMINISTRATOR",
    run: async (client, msg, arg) => {
		if (client.settings.get(msg.guild.id, "autodeletecmds") === "true") msg.delete();

		var channelrenamed;
		var rolerenamed;

		const nopermEmbed = new Discord.MessageEmbed()
		.setColor(`RED`)
		.setTitle(`⛔ You don't have permission to use this!`)

		const novalueEmbed = new Discord.MessageEmbed()
		.setColor(`RED`)
		.setTitle("💾Guild Settings")
		.setDescription(`⛔ You didn't provide any key and/or value!`)

		const truefalseEmbed = new Discord.MessageEmbed()
		.setColor(`RED`)
		.setTitle("💾Guild Settings")
		.setDescription(`⛔ That key can only be set to **true** or **false**`)

		const cooldownEmbed = new Discord.MessageEmbed()
		.setColor(`RED`)
		.setTitle("💾Guild Settings")
		.setDescription(`⛔ That key can only be set to a number between **0-60**`)

		const nokeyEmbed = new Discord.MessageEmbed()
		.setColor(`RED`)
		.setTitle("💾Guild Settings")
		.setDescription(`⛔ Couldn't find that key! Do ${client.settings.get(msg.guild.id, "prefix")}showconfig to get key names`)

		if (!msg.member.hasPermission("ADMINISTRATOR")) return msg.reply(nopermEmbed).then(msg => msg.delete({ timeout: 5000 }));

		if (!arg[0] || !arg[1]) return msg.channel.send(novalueEmbed).then(msg => msg.delete({ timeout: 5000 }));
		const [prop, ...value] = arg;
		if(!client.settings.has(msg.guild.id, prop)) {
			return msg.reply(nokeyEmbed).then(msg => msg.delete({ timeout: 5000 }));
		  }

		if (arg[0].includes("only") || arg[0].includes("delete")) {
			if (arg.slice(1).join('') !== "true" && arg.slice(1).join('') !== "false") return msg.channel.send(truefalseEmbed).then(msg => msg.delete({ timeout: 5000 }));
		}
		if (arg[0].includes("cooldown")) {
			if (isNaN(arg.slice(1).join('')) || arg[1] > 60 || arg[1] < 0) return msg.channel.send(cooldownEmbed).then(msg => msg.delete({ timeout: 5000 }));
		}

		if (arg[0].includes("channel") || arg[0].includes("category")) {
			if (!arg[0].includes("only")) {
				const channelold = prop;
				const channelnew = value.join(" ");
				const channelmodify = msg.guild.channels.cache.find(channelmodify => channelmodify.name === (client.settings.get(msg.guild.id, channelold)));
				if (!channelmodify) channelrenamed = 0;
					else {channelrenamed = 1;
						channelmodify.setName(channelnew);
					}
			}
		}

		if (arg[0].includes("role")) {
			const roleold = prop;
			const rolenew = value.join(" ");
			const rolemodify = msg.guild.roles.cache.find(rolemodify => rolemodify.name === (client.settings.get(msg.guild.id, roleold)));
			if (!rolemodify) rolerenamed = 0;
				else {rolerenamed = 1;
					rolemodify.edit({ name: rolenew });
				}
		}

		client.settings.set(msg.guild.id, value.join(" "), prop);

		const changedEmbed = new Discord.MessageEmbed()
			.setColor('RANDOM')
			.setTitle("💾Guild Settings")
			.setDescription(`**${prop}** has been changed to: \`${value.join(" ")}\``)
		
		if (channelrenamed === 1) changedEmbed.setFooter("Found and renamed the old channel")
		if (channelrenamed === 0) changedEmbed.setFooter("Couldn't find the old channel, delete it manually and then run the setup again to create the new one!")
		if (rolerenamed === 1) changedEmbed.setFooter("Found and renamed the old role")
		if (rolerenamed === 0) changedEmbed.setFooter("Couldn't find the old role, delete it manually and then run the setup again to create the new one!")
		
		msg.channel.send(changedEmbed).then(msg => msg.delete({ timeout: 5000 }));
    }
}
