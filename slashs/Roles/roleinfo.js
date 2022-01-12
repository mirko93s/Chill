const Discord = require("discord.js");

module.exports = {
    name: "roleinfo",
    description: "Returns role info",
    options: [
        {
            name: 'role',
            description: 'Role you want to get info about',
            type: 'ROLE',
            required: true,
        }
    ],
    run: async (client, interaction, arg) => {

        const role = interaction.options.getRole('role');

        const embed = new Discord.MessageEmbed()
            .setColor(role.hexColor)
            .setTitle('Role Info')
            .setDescription(`${role} \`${role.id}\``)
            .addField('Created At', role.createdAt.toDateString(), true)
            .addField("Mentionable", role.mentionable ? 'Yes' : 'No', true)
            .addField("Separate Category", role.hoist.toString(), true)
            .addField("Users counter", role.members.size.toString(), true)
            .addField("Hex Color", role.hexColor, true)
            .addField("Permissions", `\`${role.permissions.toArray().join(', ')}\``)
        interaction.reply({embeds:[embed]});
    }
}
