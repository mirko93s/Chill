const Discord = require("discord.js");

module.exports = {
    name: "userrole",
    description: "Give or take a role to/from someone",
    userPerms: ['MANAGE_ROLES'],
    botPerms: ['MANAGE_ROLES'],
    options: [
        {
            name: 'mode',
            description: 'Select a mode',
            type: 'STRING',
            required: true,
            choices: [
                {name:'give', value:'give'},
                {name:'take', value:'take'},
            ]
        },
        {
            name: 'user',
            description: 'User to edit the roles to',
            type: 'USER',
            required: true,
        },
        {
            name: 'role',
            description: 'Select a role',
            type: 'ROLE',
            required: true,
        }
    ],
    run: async (client, interaction, arg) => {

        const mode = interaction.options.getString('mode');
        const user = interaction.options.getMember('user');
        const role = interaction.options.getRole('role');
        const checkrole = user.roles.cache.some(r => r === role);

        const hierarchyEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setDescription(`⛔ I can't manage the role ${role} due to roles hierarchy.`)
        const alreadyEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setDescription(`⛔ ${user} already has that role`)
        const nothaveEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setDescription(`⛔ ${user} doesn't have that role`)

        if (interaction.guild.me.roles.highest.position < role.rawPosition) return interaction.reply({ephemeral:true, embeds:[hierarchyEmbed]});

        if (mode === 'give') {
            if (checkrole) return interaction.reply({ephemeral:true, embeds:[alreadyEmbed]});
            else await user.roles.add(role);
        } else {
            if (!checkrole) return interaction.reply({ephemeral:true, embeds:[nothaveEmbed]});
            else await user.roles.remove(role);
        }

        const doneEmbed = new Discord.MessageEmbed()
            .setColor(`GREEN`)
            .setDescription(`✅ **${role}** has been ${mode}n ${mode === 'give'?'to':'from'} ${user}`)
        return interaction.reply({embeds:[doneEmbed]});
    }
}
