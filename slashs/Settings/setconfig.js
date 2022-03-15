const Discord = require("discord.js");

module.exports = {
    name: "setconfig",
    description: "Change a config's value",
	userPerms: ['ADMINISTRATOR'],
	options: [
		{
			name: 'channels',
			description: 'Change bot\'s channels',
			type: 'SUB_COMMAND_GROUP',
			options: [
				{
					name: 'text',
					description: 'Change bot\'s text channels',
					type: 'SUB_COMMAND',
					options: [
						{
							name: 'channel',
							description: 'Select a channel',
							type: 'STRING',
							required: true,
							choices: [
								{name: 'Welcome (join/leave log)', value: 'welcomechannel'},
								{name: 'Announcements', value: 'bcchannel'},
								{name: 'Punishments (ban, kick, etc... log)', value: 'puchannel'},
								{name: 'Reports (User and Message reports)', value: 'reportchannel'},
								{name: 'Giveaway', value: 'gachannel'},
								{name: 'Poll', value: 'pollchannel'},
								{name: 'Song-Request', value: 'musictextchannel'},
							]
						},
						{
							name: 'newchannel',
							description: 'Set new channel',
							type: 'CHANNEL',
							channelTypes: ['GUILD_TEXT','GUILD_NEWS'],
							required: true,
						}
					]
				},
				{
					name: 'voice',
					description: 'Change bot\'s voice channels',
					type: 'SUB_COMMAND',
					options: [
						{
							name: 'channel',
							description: 'Select a channel',
							type: 'STRING',
							required: true,
							choices: [
								{name: 'Music', value: 'musicvocalchannel'},
							]
						},
						{
							name: 'newchannel',
							description: 'Set new channel',
							type: 'CHANNEL',
							channelTypes: ['GUILD_VOICE'],
							required: true,
						}
					]
				},
				{
					name: 'category',
					description: 'Change bot\'s cateogory channels',
					type: 'SUB_COMMAND',
					options: [
						{
							name: 'channel',
							description: 'Select a channel',
							type: 'STRING',
							required: true,
							choices: [
								{name: 'Tickets', value: 'ticketcategory'},
							]
						},
						{
							name: 'newchannel',
							description: 'Set new channel',
							type: 'CHANNEL',
							channelTypes: ['GUILD_CATEGORY'],
							required: true,
						}
					]
				},
			]
		},	
		{
			name: 'roles',
			description: 'Change bot\'s roles',
			type: 'SUB_COMMAND',
			options: [
				{
					name: 'role',
					description: 'Select a role',
					type: 'STRING',
					required: true,
					choices: [
						{name: 'Music temp', value: 'musictemprole'},
						{name: 'DJ', value: 'djrole'},
						{name: 'Staff', value: 'supportrole'},
						{name: 'Welcome (given on-join)', value: 'roleonjoin'},
					]
				},
				{
					name: 'newrole',
					description: 'Set new role',
					type: 'ROLE',
					required: true,
				}
			]
		},
		{
			name: 'other',
			description: 'Change other bot\'s settings',
			type: 'SUB_COMMAND_GROUP',
			options: [
				{
					name: 'strings',
					description: 'Change bot\'s string settings',
					type: 'SUB_COMMAND',
					options: [
						{
							name: 'string',
							description: 'Select a config',
							type: 'STRING',
							required: true,
							choices: [
								{name: 'Prefix (max 10 characters)', value: 'prefix'},
							]
						},
						{
							name: 'newvalue',
							description: 'Set new value',
							type: 'STRING',
							required: true,
						}
					]
				},
				{
					name: 'numbers',
					description: 'Change bot\'s numeral settings',
					type: 'SUB_COMMAND',
					options: [
						{
							name: 'number',
							description: 'Select a config',
							type: 'STRING',
							required: true,
							choices: [
								{name: 'XP Cooldown', value: 'xpcooldown'},
							]
						},
						{
							name: 'newvalue',
							description: 'Set new value',
							type: 'INTEGER',
							required: true,
							minValue: 1,
							maxValue: 60,
						}
					]
				},
				{
					name: 'toggles',
					description: 'Change bot\'s toggles',
					type: 'SUB_COMMAND',
					options: [
						{
							name: 'toggle',
							description: 'Select a toggle',
							type: 'STRING',
							required: true,
							choices: [
								{name: 'Limit music commands to Song-Request channel', value: 'musicchannelonly'},
								{name: 'Auto delete user commands', value: 'autodeletecmds'},
								{name: 'XP Leveling System', value: 'xpmodule'},
								{name: 'Join/Leave Messages', value: 'welcomemessage'},
								{name: 'Welcome Role', value: 'welcomerole'},
								{name: 'DJ role required to play Music', value: 'djrequired'},
							]
						},
						{
							name: 'enabled',
							description: 'Enable/Disable',
							type: 'BOOLEAN',
							required: true,
						}
					]
				},
			]
		},	
	],
    run: (client, interaction, arg) => {

		const nokeyEmbed = new Discord.MessageEmbed()
			.setColor(`RED`)
			.setTitle("💾Guild Settings")
			.setDescription(`⛔ Couldn't find that key! Do \`${client.settings.get(interaction.guild.id, 'prefix')}showconfig\` to get key names`)

		let config_key, value;

		switch(interaction.options.getSubcommandGroup()) {
			case 'channels':
				config_key = interaction.options.getString('channel');
				value = interaction.options.getChannel('newchannel').id;
				break;
			case 'roles':
				config_key = interaction.options.getString('role');
				value = interaction.options.getRole('newrole').id;
				break;
			case 'other':
				switch (interaction.options.getSubcommand()) {
					case 'strings':
						config_key = interaction.options.getString('string');
						value = interaction.options.getString('newvalue').substring(0,10);
						break;
					case 'numbers':
						config_key = interaction.options.getString('number');
						value = interaction.options.getInteger('newvalue');
						break;
					case 'toggles':
						config_key = interaction.options.getString('toggle');
						value = interaction.options.getBoolean('enabled');
						break;
				}
				break;		
			
		}

		if(!client.settings.has(interaction.guild.id, config_key)) {
			return interaction.reply({ephemeral:true, embeds: [nokeyEmbed]});
		} else client.settings.set(interaction.guild.id, value, config_key);

		const changedEmbed = new Discord.MessageEmbed()
			.setColor('RANDOM')
			.setTitle("💾Guild Settings")
			.setDescription(`**${config_key}** has been changed to: \`${value}\``)
		interaction.reply({embeds:[changedEmbed]});
    }
}
