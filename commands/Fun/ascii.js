const Discord = require("discord.js");
const figlet = require('figlet');

module.exports = {
    name: "ascii",
    category: "Fun",
    description: "Convert any string to ascii art",
    usage: "ascii <text>\n**e.g.**\n\`ascii Hello World!\`\n> The Bot will send a message with \"Hello World!\" text using a cool ascii font",
    run: async (client, msg, arg) => {

        const argErrEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Provide a text (max 50 characters)`)

        const string = arg.join(" ").replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g,''); //remove emojis
        if(!string || string.length > 50) return msg.channel.send({embeds:[argErrEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5e3));

        figlet.text(string, {
            font: 'standard',
            horizontalLayout: 'default',
            verticalLayout: 'default',
            width: 120,
            whitespaceBreak: true
        }, function(err, data) {
            if (err) {
                return console.log(err);
            }    
            return msg.channel.send({content:`\`\`\`console\n${data}\`\`\``});
        });

    }
}
