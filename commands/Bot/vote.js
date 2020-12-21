const Discord = require("discord.js");
const config = require('../../config.json');

module.exports = {
    name: "vote",
    category: "Bot",
    description: "Bot's Vote link",
    usage: "vote\n**e.g.**\n\`vote\`\n> Returns a link to the bot's Top.gg vote page\n> You can vote once every 12 hours\n> Thanks for voting 💜💜💜",
    run: async (client, msg, arg) => {
        if (client.settings.get(msg.guild.id, "autodeletecmds") === "true") msg.delete();
        msg.channel.send(config.bot_vote_link);
    }
}
