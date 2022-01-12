const Discord = require("discord.js");

module.exports = {
    name: "guilds",
    description: "Get a list of all guilds the bot is in.",
    dev: true,
    options: null,
    run: async (client, interaction, arg) => {

        console.log(`Guilds Size: ${client.guilds.cache.size}`);
        console.log("---------------------------");
        client.guilds.cache.forEach(guild => {
            console.log(guild.name);           
        });
        console.log("---------------------------");

        interaction.reply({ephemeral:true, content:'⚠️Guilds list has been logged in the console'});
    }
}
