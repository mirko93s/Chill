const Discord = require("discord.js");

module.exports = {
    name: "blast",
    description: "DM to all server owners",
    dev: true,
    options: [
        {
            name: 'text',
            description: 'Message to send',
            type: 'STRING',
            required: true,
        }
    ],
    run: async (client, interaction, arg) => {

        const blastEmbed = new Discord.MessageEmbed()
            .setColor(`PURPLE`)
            .setTitle(`📢 **BOT UPDATE**`)
            .setDescription(interaction.options.getString('text'))
            .setFooter({text: `by ${interaction.member.username}`,iconURL: interaction.member.displayAvatarURL()})

        var owners = [];
        client.guilds.cache.forEach(guild => owners.push(guild.ownerId));
        owners = owners.filter(function(elem, index, self) {return index === self.indexOf(elem);})
        
        owners.forEach((owner, delay) => {
            setTimeout(() => {
                client.users.cache.get(owner).send({embeds:[blastEmbed]});
            }, delay*5e3);
        });

        return interaction.reply({ephemeral:true, content:'**Blasted all owners!**'});
    }
}