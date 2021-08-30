const Discord = require("discord.js");

module.exports = {
    name: "setconfig",
    category: "Settings",
    description: "Change a config's value",
    usage: "setconfig <key> <value>\n**e.g.**\n\`setconfig prefix ?\`\n> will set the prefix to \"?\"\n\`setconfig mutedrole 123456789012334567890\`\n> will change the mutedrole id to \"123456789012334567890\"\n\`setconfig welcomechannel 123456789012334567890\`\n> will change the welcomechannel id to 123456789012334567890\n\n> Run setup command to fix the missing channels/roles \n> Check showconfig command for keys/values list",
    permission: "ADMINISTRATOR",
    run: (client, msg, arg) => {

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
			.setDescription(`⛔ Couldn't find that key! Do \`${client.settings.get(msg.guild.id, 'prefix')}showconfig\` to get key names`)
		const nonewidEmbed = new Discord.MessageEmbed()
			.setColor(`RED`)
			.setTitle("💾Guild Settings")
			.setDescription(`⛔ That ID doesn't exists on this server.`)

		if (!msg.member.permissions.has("ADMINISTRATOR")) return msg.channel.send({embeds:[nopermEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));

		const settings = {
			channels: {
				welcome: 'welcomechannel',
				broadcast: 'bcchannel',
				punishments: 'puchannel',
				reports: 'reportchannel',
				giveaway: 'gachannel',
				poll: 'pollchannel',
				musictext: 'musictextchannel',
				musicvoice: 'musicvocalchannel',
				ticket: 'ticketcategory',
			},
			roles: {
				musictemp: 'musictemprole',
				muted: 'mutedrole',
				dj: 'djrole',
				support: 'supportrole',
				onjoin: 'roleonjoin',
			},
			other: {
				prefix: 'prefix',
			},
			numbers: {
				xpcooldown: 'xpcooldown',
			},
			toggles: {
				musictextonly: 'musicchannelonly',
				autodeletecmds: 'autodeletecmds',
				xp: 'xpmodule',
				welcomemsg: 'welcomemessage',
				welcomerole: 'welcomerole',
				djrequired: 'djrequired',
			}
		}

		if (!arg[0] || !arg[1]) return msg.channel.send({embeds:[novalueEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
		let prop = arg[0];
		var value = arg.slice(1).join(" ");

		// toggles
		if (Object.keys(settings.toggles).includes(arg[0])) {
			prop = settings.toggles[arg[0]];
			if (arg.slice(1).join('') !== "true" && arg.slice(1).join('') !== "false") return msg.channel.send({embeds:[truefalseEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
		}
		// numbers
		if (Object.keys(settings.numbers).includes(arg[0])) {
			prop = settings.numbers[arg[0]];
			if (isNaN(arg.slice(1).join('')) || arg[1] > 60 || arg[1] < 0) return msg.channel.send({embeds:[cooldownEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
		}
		// channels
		if (Object.keys(settings.channels).includes(arg[0])) {
			prop = settings.channels[arg[0]];
			let channelnewid = value;
			if (isNaN(channelnewid)) { //if string search channel name in the guild
				channelnewid = msg.guild.channels.cache.find(c => c.name === channelnewid);
				if (!channelnewid) return msg.channel.send({embeds:[nonewidEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
				else value = channelnewid.id;
			} else { //else check if channel id exists
				const checkchannel = msg.guild.channels.cache.find(c => c.id === channelnewid);
				if (!checkchannel) return msg.channel.send({embeds:[nonewidEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
			}
		}
		// roles
		if (Object.keys(settings.roles).includes(arg[0])) {
			prop = settings.roles[arg[0]];
			let rolenewid = value;
				if (isNaN(rolenewid)) { //if string search role name in the guild
					rolenewid = msg.guild.roles.cache.find(r => r.name === rolenewid);
					if (!rolenewid) return msg.channel.send({embeds:[nonewidEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
					else value = rolenewid.id;
				} else { //else check if role id exists
					const checkrole = msg.guild.roles.cache.find(r => r.id === rolenewid);
					if (!checkrole) return msg.channel.send({embeds:[nonewidEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
				}
		}

		if(!client.settings.has(msg.guild.id, prop)) {
			return msg.channel.send({embeds: [nokeyEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
		} else client.settings.set(msg.guild.id, value, prop);

		const changedEmbed = new Discord.MessageEmbed()
			.setColor('RANDOM')
			.setTitle("💾Guild Settings")
			.setDescription(`**${arg[0]}** has been changed to: \`${value}\``)
		msg.channel.send({embeds:[changedEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
    }
}
