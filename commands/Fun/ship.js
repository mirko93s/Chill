const Discord = require("discord.js");

module.exports = {
    name: "ship",
    category: "Fun",
    description: "Ship 2 members",
    usage: "<name1> <name2>",
    run: async (client, msg, arg) => {
        let user1 = arg[0];
        let user2 = arg.slice(1).join(' ');
        if (!user1 || !user2) return msg.channel.send("Enter 2 members to ship")
        var ship = Math.floor(Math.random() * 100) + 1;
        if (ship <= 49) {
                    const badmatch = new Discord.RichEmbed()
                    .setColor(0x00A2E8)
                    .setTitle(user1 + " and " + user2 + " do not match very well")
                    .setDescription(":broken_heart: " + ship + "% :broken_heart:");
                    msg.channel.send(badmatch);
           } else if (ship >= 90) {
                const perfectmatch = new Discord.RichEmbed()
                    .setColor(0x00A2E8)
                    .setTitle(user1 + " and " + user2 + " are meant for eachother")
                    .setDescription(":heartpulse: " + ship + "% :heartpulse:");
                    msg.channel.send(perfectmatch);
           } else {
               const match = new Discord.RichEmbed()
                    .setColor(0x00A2E8)
                    .setTitle(user1 + " and " + user2 + " match very well")
                    .setDescription(":heart: " + ship + "% :heart:");
                    msg.channel.send(match);
            }
    }
}
