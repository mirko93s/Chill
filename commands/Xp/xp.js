const Discord = require("discord.js");

module.exports = {
    name: "xp",
    category: "Xp",
    description: "Modify user's xp points",
    usage: "xp <mention> <give | take | set> <amount>\n**e.g**\n\`xp @mirko93s give 100\`\n> add 100 xp points to mirko93s\n\`xp @mirko93s take 50\`\n> remove 50 xp points from mirko93s\n\`xp @mirko93s set 25\`\n> set mirko93s' total xp points to 25 (set it to 0 to reset a member)\n> The level will be automatically updated on the next user's message",
    permission: "ADMINISTRATOR",
    run: async (client, msg, arg) => {
        
    }
}
