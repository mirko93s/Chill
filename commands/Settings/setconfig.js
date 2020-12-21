const Discord = require("discord.js");

module.exports = {
    name: "setconfig",
    category: "Settings",
    description: "Change a config's value",
    usage: "setconfig <key> <value>\n**e.g.**\n\`setconfig prefix ?\`\n> will set the prefix to \"?\"\n\`setconfig mutedrole 123456789012334567890\`\n> will change the mutedrole id to \"123456789012334567890\"\n\`setconfig welcomechannel 123456789012334567890\`\n> will change the welcomechannel id to 123456789012334567890\n\n> Run setup command to fix the missing channels/roles \n> Check showconfig command for keys/values list",
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
		const nonewidEmbed = new Discord.MessageEmbed()
			.setColor(`RED`)
			.setTitle("💾Guild Settings")
			.setDescription(`⛔ That ID doesn't exists on this server.`)

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
				const channelnewid = msg.guild.channels.cache.find(c => c.id === (value.join(" ")));
				if (!channelnewid) return msg.channel.send(nonewidEmbed).then(msg => msg.delete({ timeout: 5000 }));
			}
		}

		if (arg[0].includes("role")) {
			const rolenewid = msg.guild.roles.cache.find(r => r.id === (value.join(" ")));
			if (!rolenewid) return msg.channel.send(nonewidEmbed).then(msg => msg.delete({ timeout: 5000 }));
		}

		client.settings.set(msg.guild.id, value.join(" "), prop);

		const changedEmbed = new Discord.MessageEmbed()
			.setColor('RANDOM')
			.setTitle("💾Guild Settings")
			.setDescription(`**${prop}** has been changed to: \`${value.join(" ")}\``)
		
		msg.channel.send(changedEmbed).then(msg => msg.delete({ timeout: 5000 }));
    }
}
