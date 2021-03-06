const Discord = require("discord.js");
const ms = require ("ms");

module.exports = {
    name: "remindme",
    aliases: ["remind", "reminder"],
    category: "Other",
    description: "Allows you to set a reminder for yourself.",
    usage: "reminder <time-s-m-h-d-w> <text>\n**e.g.**\n\`remindme 10h buy milk\`\nThe bot will tag you and remind you the message after the given time\nThe text can't be longer than 2048 characthers.",
    run: async (client, msg, arg) => {
        
        const noargsEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Please provide a valid time and a valid text`)
        
        let time = arg[0];
        let text = arg.slice(1).join(' ');

        if(!time || !time.match(/[1-60][s,m,h,d,w]/g) || !text || text.length > 2048) return msg.channel.send(noargsEmbed).then(msg => msg.delete({ timeout: 5000 }));

        let timems = ms(time);

        function reminder() {
            const reminderEmbed = new Discord.MessageEmbed()
                .setColor(`RANDOM`)
                .setTitle(`**REMINDER**`)
                .setDescription(`${msg.member.user} ${text}`)
            msg.reply(reminderEmbed);
        }

        msg.reply(`Your reminder has been set, I will remind you in ${time}.`).then(msg => msg.delete({timeout:10000}));
        setTimeout(reminder, timems);
    }
}
