const Discord = require("discord.js");
const config = require('../../config.json');

module.exports = {
    name: "mcstat",
    description: "Get Minecraft server banners",
    options: [
        {
            name: "server",
            description: "IP of the server",
            type: 'STRING',
            required: true,
        },
    ],
    run: async (client, interaction, arg) => {
        
        let serverip = interaction.options.getString('server');
        if (!serverip) serverip = config.mc_default_ip;

        if (serverip.includes(':')) serverip=serverip.replace(/:/g, '/');
            else serverip+='/25565';
        
        const embed = new Discord.MessageEmbed()
            .setAuthor({name: 'Minecraft Server Status', iconURL: 'https://i.imgur.com/BupabSS.png'})
            .setTitle(`***${serverip}***`)
            .setColor(`RANDOM`)
            .setImage("http://status.mclive.eu/Server/" + serverip + "/banner.png")

        interaction.reply({embeds:[embed]});
    }
}
