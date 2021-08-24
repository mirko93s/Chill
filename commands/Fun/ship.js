const Discord = require("discord.js");

module.exports = {
    name: "ship",
    category: "Fun",
    description: "Ship 2 members",
    usage: "ship <name1> <name2>\n**e.g.**\n\`ship name_1 name_2\`\n> Check the affinity between 2 people",
    run: async (client, msg, arg) => {

        const nonamesEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Enter 2 names to ship`)

        let user1 = arg[0];
        let user2 = arg[1];
        if (!user1 || !user2) return msg.channel.send({embeds:[nonamesEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5e3));
        var ship = Math.floor(Math.random() * 100) + 1;

        let bar = "";

        for (var i=0; i < Math.round(ship/10) ; i++) {
            bar += "⬜";
        }
        for (var i=0; i < 10-Math.round(ship/10) ; i++) {
            bar += "🔳";
        }

        let shipEmbed = new Discord.MessageEmbed()
            .setFooter(`${bar} ${ship}%`);

        switch (true) {
            case (ship>=0 && ship <=19):
                shipEmbed
                    .setColor(`640000`)
                    .setTitle(`💔 SHIP 💔`)
                    .setDescription(`🔻 ${user1}\n🔺 ${user2}\n**Do not match at all**`)
                msg.channel.send({embeds:[shipEmbed]});
                break;
            case (ship>=20 && ship <=49):
                shipEmbed
                    .setColor(`960000`)
                    .setTitle(`❤️ SHIP ❤️`)
                    .setDescription(`🔻 ${user1}\n🔺 ${user2}\n**Do not match well**`)
                msg.channel.send({embeds:[shipEmbed]});
                break;
            case (ship>=50 && ship <=89):
                shipEmbed
                    .setColor(`C80000`)
                    .setTitle(`💓 SHIP 💓`)
                    .setDescription(`🔻 ${user1}\n🔺 ${user2}\n**Match very well**`)
                msg.channel.send({embeds:[shipEmbed]});
                break;
            case (ship>=90 && ship <=100):
                shipEmbed
                    .setColor(`FA0000`)
                    .setTitle(`💗 SHIP 💗`)
                    .setDescription(`🔻 ${user1}\n🔺 ${user2}\n**Are meant to eachother**`)
                msg.channel.send({embeds:[shipEmbed]});
                break;
        };
    }
}
