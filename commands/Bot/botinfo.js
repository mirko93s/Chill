const Discord = require("discord.js");
const fs = require("fs")
const discordjs_version = "v6.9.0"
const bot_version = "v2.0"

module.exports = {
    name: "botinfo",
    aliases: ["bot"],
    category: "Bot",
    description: "Returns Bot info",
    run: async (client, msg, arg) => {
        fs.readdir("./commands/", (err, files) => {
            const filez = files.length
            if (err) return console.error(err);
            //sql.get(`SELECT * FROM scores WHERE guildId ="${msg.guild.id}"`).then(row => {
            //if (!row) return;
           const embed = new Discord.RichEmbed()
                 .setAuthor(client.user.username/*, client.user.avatarURL*/)
                 .setColor(0x00A2E8)
                 .setThumbnail(client.user.avatarURL)
                 .addField("Memory", `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}` + " MB", true)
                 //.addField("Commands:", `${filez + 11}`)
                 .addField('Total Users', `${client.users.size}`, true)
                 .addField('Total Channels:', `${client.channels.size}`, true)
                 .addField('Total Servers', Math.ceil(client.guilds.size), true)
                 .addField('Bot Created', client.user.createdAt.toLocaleString())
                 .addField('Library', `discord.js ${discordjs_version}`, true)
                 .addField('Node.js Version', process.version, true)
                 .addField('Bot Version', `${bot_version}`, true)
                 .setTimestamp()
                 .setFooter(client.user.username, client.user.avatarURL);
           msg.channel.send({embed}) 
                // })
           })
    }
}
