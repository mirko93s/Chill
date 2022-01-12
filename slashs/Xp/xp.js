const Discord = require("discord.js");

module.exports = {
    name: "xp",
    description: "Change user's XP points",
    userPerms: ['ADMINISTRATOR'],
	options: [
		{
			name: 'user',
			description: 'User to change the xp to',
			type: 'USER',
			required: true,
		},
		{
			name: 'mode',
			description: 'Select a mode',
			type: 'STRING',
			required: true,
			choices: [
				{name: 'give', value: 'give'},
				{name: 'take', value: 'take'},
				{name: 'set', value: 'set'}
			]
		},
		{
			name: 'amount',
			description: 'Amount of xp points',
			type: 'INTEGER',
			required: true,
			minValue: 0,
		}
	],
    run: async (client, interaction, arg) => {

		const nonegativeEmbed = new Discord.MessageEmbed()
			.setColor(`RED`)
			.setTitle(`⛔ User points can't go negative!`)
		const moduleDisabledEmbed = new Discord.MessageEmbed()
			.setColor(`RED`)
			.setTitle(`⛔ This module is disabled on this server!`)

		if (client.settings.get(interaction.guild.id, "xpmodule") === "false") return interaction.reply({ephemeral:true, embeds:[moduleDisabledEmbed]});
		let user = interaction.options.getMember('user');
		// let pointsToAdd = parseInt(arg[2], 10);
		let pointsToAdd = interaction.options.getInteger('amount');
		client.settings.ensure(interaction.guild.id, {level: 0, points: 0}, `xp.${user.id}`);	
		let userScore = client.settings.get(interaction.guild.id, `xp.${user.id}`);	
		
		switch(interaction.options.getString('mode')){
			case 'give':
				var newPoints = userScore.points + pointsToAdd;
				var xpmsg = "+";
				break;
			case 'take':
				if(userScore.points-pointsToAdd < 0) return interaction.reply({ephemeral:true, embeds:[nonegativeEmbed]});
				var newPoints = userScore.points - pointsToAdd;
				var xpmsg = "-";
				break;
			case 'set':
				var newPoints = pointsToAdd;
				var xpmsg = "Set to";
				break;
		}

		let newLevel = Math.floor(0.3163 * Math.sqrt(newPoints));
		//check for level rewards to give or take
		var rewards = client.settings.get(interaction.guild.id, `rewards`);
		var unlocked = "";
		if (newLevel > userScore.level) {
			for (const [key, value] of Object.entries(rewards)) {
				if (value <= newLevel && value > userScore.level) {
					const checkrole = interaction.guild.roles.cache.find(r => r.id === key); //check if role exists
					if (checkrole && interaction.guild.me.roles.highest.position > checkrole.rawPosition) { //give role checking hierarchy
						interaction.member.roles.add(checkrole.id);
						unlocked += `${interaction.guild.roles.cache.find(r => r.id === key).name}\n`;
					}
				}
			};
		} else if (newLevel < userScore.level) {
			for (const [key, value] of Object.entries(rewards)) {
				if (value <= userScore.level && value > newLevel) {
					const checkrole = interaction.guild.roles.cache.find(r => r.id === key); //check if role exists
					if (checkrole && interaction.guild.me.roles.highest.position > checkrole.rawPosition) { //remove role checking hierarchy
						interaction.member.roles.remove(checkrole.id);
						unlocked += `${interaction.guild.roles.cache.find(r => r.id === key).name}\n`;
					}
				}
			};
		}
		
		client.settings.set(interaction.guild.id, {level: newLevel, points: newPoints}, `xp.${user.id}`);
		const xpEmbed = new Discord.MessageEmbed()
			.setColor(`RANDOM`)
			.setAuthor({name: `${user.username}'s experience`, iconURL: user.displayAvatarURL()})
			.setTitle(`${xpmsg} **${client.chill.fancyNumber(pointsToAdd)}** point${pointsToAdd > 1 || pointsToAdd == 0 ? "s" : ""}`)
			.setFooter({text: `by ${interaction.user.username}`})

		if (newLevel != userScore.level) xpEmbed.setTitle(`**${xpmsg} ${client.chill.fancyNumber(pointsToAdd)} points**\n*New level is: ${newLevel}*`)
		if (unlocked.length > 0) {
			if (newLevel > userScore.level) xpEmbed.setDescription(`***Unlocked roles:\n${unlocked}***`)
			else if (newLevel < userScore.level) xpEmbed.setDescription(`***Taken roles:\n${unlocked}***`)
		}
		return interaction.reply({embeds:[xpEmbed]});
    }
}