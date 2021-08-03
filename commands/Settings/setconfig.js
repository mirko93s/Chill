const Discord = require("discord.js");

module.exports = {
    name: "setconfig",
    category: "Settings",
    description: "Change a config's value",
    usage: "setconfig <key> <value>\n**e.g.**\n\`setconfig prefix ?\`\n> will set the prefix to \"?\"\n\`setconfig mutedrole 123456789012334567890\`\n> will change the mutedrole id to \"123456789012334567890\"\n\`setconfig welcomechannel 123456789012334567890\`\n> will change the welcomechannel id to 123456789012334567890\n\n> Run setup command to fix the missing channels/roles \n> Check showconfig command for keys/values list",
    permission: "ADMINISTRATOR",
    run: async (client, msg, arg) => {

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
		const prop = arg[0];
		var value = arg.slice(1).join(" ");
		if(!client.settings.has(msg.guild.id, prop)) {
			return msg.reply(nokeyEmbed).then(msg => msg.delete({ timeout: 5000 }));
		  }

		if (arg[0].includes("only") || arg[0].includes("delete") || arg[0].includes("xpmodule") || arg[0].includes("welcomemessage") || arg[0].includes("welcomerole")) {
			if (arg.slice(1).join('') !== "true" && arg.slice(1).join('') !== "false") return msg.channel.send(truefalseEmbed).then(msg => msg.delete({ timeout: 5000 }));
		}
		if (arg[0].includes("cooldown")) {
			if (isNaN(arg.slice(1).join('')) || arg[1] > 60 || arg[1] < 0) return msg.channel.send(cooldownEmbed).then(msg => msg.delete({ timeout: 5000 }));
		}

		if (arg[0].includes("channel") || arg[0].includes("category")) {
			if (!arg[0].includes("only")) {
				var channelnewid = value;
				if (isNaN(channelnewid)) { //if string search channel name in the guild
					channelnewid = msg.guild.channels.cache.find(c => c.name === channelnewid);
					if (!channelnewid) return msg.channel.send(nonewidEmbed).then(msg => msg.delete({ timeout: 5000 }));
					else value = channelnewid.id;
				} else { //else check if channel id exists
					const checkchannel = msg.guild.channels.cache.find(c => c.id === channelnewid);
					if (!checkchannel) return msg.channel.send(nonewidEmbed).then(msg => msg.delete({ timeout: 5000 }));
				}
			}
		}

		if (arg[0].includes("role") && arg[0] !== "welcomerole") {
			var rolenewid = value;
				if (isNaN(rolenewid)) { //if string search role name in the guild
					rolenewid = msg.guild.roles.cache.find(r => r.name === rolenewid);
					if (!rolenewid) return msg.channel.send(nonewidEmbed).then(msg => msg.delete({ timeout: 5000 }));
					else value = rolenewid.id;
				} else { //else check if role id exists
					const checkrole = msg.guild.roles.cache.find(r => r.id === rolenewid);
					if (!checkrole) return msg.channel.send(nonewidEmbed).then(msg => msg.delete({ timeout: 5000 }));
				}
		}

		client.settings.set(msg.guild.id, value, prop);

		const changedEmbed = new Discord.MessageEmbed()
			.setColor('RANDOM')
			.setTitle("💾Guild Settings")
			.setDescription(`**${prop}** has been changed to: \`${value}\``)
		
		msg.channel.send(changedEmbed).then(msg => msg.delete({ timeout: 5000 }));
    }
}
