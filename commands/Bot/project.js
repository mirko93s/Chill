const Discord = require("discord.js");
const config = require('../../config.json');

module.exports = {
    name: "project",
    aliases: ["github"],
    category: "Bot",
    description: "Bot's Github link",
    usage: "project\n**e.g.**\n\`project\`\n> Returns a link to the bot's Github project page\n> On Github you can read all the code behind the Bot\n> And you can check latest releases or upcoming features",
    run: async (client, msg, arg) => {
        msg.delete();
        msg.channel.send(config.bot_project_link)
    }
}
