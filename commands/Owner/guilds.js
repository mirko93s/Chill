const Discord = require("discord.js");
const config = require('../../config.json');

module.exports = {
    name: "guilds",
    category: "Owner",
    description: "Get a list of all guilds the bot is in.",
    usage: "guilds\n**e.g.**\n\`guilds\`\n> List all guilds",
    permission: "DEV",
    run: async (client, msg, arg) => {

        const nopermEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ You don't have permission to use this!`)

        const doneEmbed = new Discord.MessageEmbed()
            .setColor(`RANDOM`)
            .setTitle(`Successfully listed all guilds`)
            .setDescription(`Check the console.`)

        if (msg.author.id !== config.bot_owner) return msg.channel.send({embeds:[nopermEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));

        console.log(`Guilds Size: ${client.guilds.cache.size}`);
        console.log("---------------------------");
        client.guilds.cache.forEach(guild => {
            console.log(guild.name);           
        });
        console.log("---------------------------");

        msg.channel.send({embeds:[doneEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
    }
}
