const Discord = require("discord.js");
const config = require('../../config.json');

module.exports = {
    name: "rewards",
    description: "Unlockable roles based on XP level",
    botPerms: ['MANAGE_ROLES'],
    options: [
        {
			name: 'list',
			description: 'List all roles awarded by leveling up',
			type: 'SUB_COMMAND',
			options: null,
		},
        {
			name: 'set',
			description: 'Set a new reward',
			type: 'SUB_COMMAND',
			options: [
				{
					name: 'level',
					description: 'Select a channel',
					type: 'INTEGER',
					required: true,
                    minValue: 1,
				},
				{
					name: 'role',
					description: 'Choose the role to award',
					type: 'ROLE',
					required: true,
				}
			]
		},
        {
			name: 'delete',
			description: 'Delete an existing reward',
			type: 'SUB_COMMAND',
			options: [
				{
					name: 'role',
					description: 'Choose the role to delete',
					type: 'ROLE',
					required: true,
				}
			]
		},
    ],
    run: async (client, interaction, arg) => {

        const noPermEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setDescription(`⛔ You need the \`ADMINISTRATOR\` permission to use this command!`)
		const moduleDisabledEmbed = new Discord.MessageEmbed()
			.setColor(`RED`)
			.setTitle(`⛔ This module is disabled on this server!`)
        const norewardEmbed = new Discord.MessageEmbed()
			.setColor(`RED`)
            .setTitle(`⛔ That reward doesn't exist`)
        const rewardlimitEmbed = new Discord.MessageEmbed()
			.setColor(`RED`)
            .setTitle(`⛔ You have reached the maximum number of rewards you can have at the same time. Delete some of them to add new ones.`)

		if (client.settings.get(interaction.guild.id, "xpmodule") === "false") return interaction.reply({ephemeral:true, embeds:[moduleDisabledEmbed]});
        
        client.settings.ensure(interaction.guild.id, {rewards: {}});
        // list
        if(interaction.options.getSubcommand() === 'list') {
            var rewards = client.settings.get(interaction.guild.id, `rewards`);
            var sorted = {};            
            Object //sort object
            .keys(rewards).sort(function(a, b){
                return rewards[a] - rewards[b];
            })
            .forEach(function(key) {
                sorted[key] = rewards[key];
            });

            const rewardsEmbed = new Discord.MessageEmbed()
                .setColor(`RANDOM`)
                .setTitle(`Level Rewards`)
            let rolelist = '';
            for (const [key, value] of Object.entries(sorted)) {
                const checkrole = interaction.guild.roles.cache.find(r => r.id === key);
                if (!checkrole) client.settings.delete(interaction.guild.id, `sorted.${key}`);//check if role still exists otherwise delete it from the db
                else rolelist += (`Lv.${value} - ${checkrole}\n`)
            };
            if (Object.keys(rewards).length < 1) rewardsEmbed.setDescription(`No rewards have been set yet.`)
            else rewardsEmbed.setDescription(rolelist);
            return interaction.reply({embeds:[rewardsEmbed]});
        }
        // set
        if (interaction.options.getSubcommand() === 'set') { //create a new reward or change its level
            if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ephemeral:true, embeds:[noPermEmbed]});
            const level = interaction.options.getInteger('level');
            const role = interaction.options.getRole('role');
            //check rewards limit
            var rewards = client.settings.get(interaction.guild.id, `rewards`);
            if (Object.keys(rewards).length > config.rewards_limit-1) return interaction.reply({ephemeral:true, embeds:[rewardlimitEmbed]});
            //set
            client.settings.set(interaction.guild.id, level, `rewards.${role.id}`);
            const setEmbed = new Discord.MessageEmbed()
                .setColor(`RANDOM`)
                .setTitle(`Level Rewards`)
                .setDescription(`Set ${role} to be awarded at level **${level}**.`)
            return interaction.reply({ephemeral:true, embeds:[setEmbed]});
        }
        // delete
        if (interaction.options.getSubcommand() === 'delete') { //delete a reward
            if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ephemeral:true, embeds:[noPermEmbed]});
            const role = interaction.options.getRole('role');
            if(client.settings.has(interaction.guild.id, `rewards.${role.id}`)) {
                client.settings.delete(interaction.guild.id, `rewards.${role.id}`);
                const deletedEmbed = new Discord.MessageEmbed()
                    .setColor(`RANDOM`)
                    .setTitle(`Level Rewards`)
                    .setDescription(`Removed ${role} from the Rewards.`)
                return interaction.reply({embeds:[deletedEmbed]});
            }
            else return interaction.reply({ephemeral:true, embeds:[norewardEmbed]});
        }
    }
}
