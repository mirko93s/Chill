const Discord = require("discord.js");
const ms = require ("ms");

module.exports = {
    name: "remindme",
    description: 'Set a reminder for yourself, only you will be able to read it. (Open DMs are required to receive it)',
    options: [
        {
            name: "time",
            description: "Time (automatically caps at approximately 25 days)",
            type: 'INTEGER',
            required: true,
            minValue: 1,
            maxValue: 60,
        },
        {
            name: "unit",
            description: "Time unit",
            type: 'STRING',
            required: true,
            choices: [
                {
                    name: "seconds",
                    value: "s",
                },
                {
                    name: "minutes",
                    value: "m",
                },
                {
                    name: "hours",
                    value: "h",
                },
                {
                    name: "days",
                    value: "d",
                }
            ]
        },
        {
            name: "text",
            description: "What do I have to remind you?",
            type: 'STRING',
            required: true,
        },
    ],
    
    run: async (client, interaction, arg) => {
        
        let time = ms(interaction.options.getInteger('time')+interaction.options.getString('unit'));
        time > 2147483647 ? time = 2147483647 : time = time;
        let text = interaction.options.getString('text').substring(0,3072);

        const id_time = `${interaction.member.id}-${Date.now()+time}`;

        function reminder() {
            const reminderEmbed = new Discord.MessageEmbed()
                .setColor(`RANDOM`)
                .setTitle(`**REMINDER**`)
                .setDescription(text)
            client.intervals.delete('reminders',id_time)
            interaction.member.send({embeds:[reminderEmbed]}).catch(() => {return});
        }
        client.intervals.set('reminders', text, id_time);
        interaction.reply({ephemeral:true, content:`Your reminder has been set, I will remind you in ${ms(time)}.`});
        setTimeout(reminder, time);
    }
}