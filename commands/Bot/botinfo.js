const Discord = require("discord.js");
const fs = require("fs")
const os = require('os')
const cpuStat = require("cpu-stat");

const discordjs_version = "v11.5.1"
const bot_version = "v4.0"

module.exports = {
    name: "botinfo",
    aliases: ["bot"],
    category: "Bot",
    description: "Returns Bot info",
    run: async (client, msg, arg) => {
        cpuStat.usagePercent(function(err, percent, seconds) {
            if (err) {
              return console.log(err);
            }
            const embed = new Discord.RichEmbed()
                .setAuthor(client.user.username)
                .setColor(`RANDOM`)
                .setThumbnail(client.user.avatarURL)
                .addField('Bot Created', client.user.createdAt.toLocaleString(), true)//
                .addField('Total Servers', Math.ceil(client.guilds.size), true)
                .addField('Total Users', `${client.users.size}`, true)
                .addField('Total Channels:', `${client.channels.size}`, true)
                .addField('Library', `discord.js ${discordjs_version}`, true)//
                .addField('Node.js Version', process.version, true)
                .addField('Bot Version', `${bot_version}`, true)
                .addField("CPU", `\`\`\`${os.cpus().map(i => `${i.model}`)[0]}\`\`\``, true)//
                .addField("CPU usage", `\`${percent.toFixed(2)}%\``,true)//
                .addField("RAM", `\`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB\``, true)
                .addField("Arch", `\`${os.arch()}\``,true)//
                .addField("Platform", `\`${os.platform()} ${os.release}\``,true)
                .setTimestamp()
                .setFooter(client.user.username, client.user.avatarURL);
            msg.channel.send({embed}) 
        })
    }
}
