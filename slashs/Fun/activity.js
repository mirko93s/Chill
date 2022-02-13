const Discord = require("discord.js");
const fetch = require('node-fetch');

module.exports = {
    name: "activities",
    description: "Start a Discord Activity",
    botPerms: ['ADMINISTRATOR'],
    options: [
        {
            name: 'game',
            description: 'Choose a party game',
            type: 'STRING',
            required: true,
            choices:[
                {name: 'Youtube Watch Together',value: '880218394199220334'},
                {name: 'Poker Night',value: '755827207812677713'},
                {name: 'Chess In The Park',value: '832012774040141894'},
                {name: 'Betrayal.io',value: '773336526917861400'},
                {name: 'Fishington.io',value: '814288819477020702'},
                {name: 'Letter Tile',value: '879863686565621790'},
                {name: 'Word Snacks',value: '879863976006127627'},
                {name: 'Doodle Crew',value: '878067389634314250'},
                {name: 'SpellCast',value: '852509694341283871'},
                {name: 'Awkword',value: '879863881349087252'},
                {name: 'Checkers In The Park',value: '832013003968348200'},
            ]
        },
    ],
    run: async (client, interaction, arg) => {
        const errorEmbed = new Discord.MessageEmbed()
            .setColor('RED')
            .setTitle('⛔ An error occured while starting this activity')
        const noVoiceEmbed = new Discord.MessageEmbed()
            .setColor('RED')
            .setTitle('⛔ You need to be in a Voice Channel to start an activity')

        if (!interaction.member.voice.channel) return interaction.reply({ephemeral:true, embeds:[noVoiceEmbed]});
        
        const activityNames = {
            '880218394199220334':'Youtube Watch Together',
            '755827207812677713':'Poker Night',
            '832012774040141894':'Chess In The Park',
            '773336526917861400':'Betrayal.io',
            '814288819477020702':'Fishington.io',
            '879863686565621790':'Letter Tile',
            '879863976006127627':'Word Snacks',
            '878067389634314250':'Doodle Crew',
            '852509694341283871':'SpellCast',
            '879863881349087252':'SpellCast',
            '832013003968348200':'Checkers In The Park',
        }
        try {
            await fetch(`https://discord.com/api/v8/channels/${interaction.member.voice.channelId}/invites`, {
                method: 'POST',
                body: JSON.stringify({
                max_age: 86400,
                max_uses: 0,
                target_application_id: interaction.options.getString('game'),
                target_type: 2,
                temporary: false,
                validate: null,
                }),
                headers: {
                Authorization: `Bot ${client.token}`,
                'Content-Type': 'application/json',
                },
            })
            .then((res) => res.json()).then(invite => {
                if (invite.error || !invite.code || invite.code == 50013) return interaction.reply({ephemeral:true, embeds:[errorEmbed]});
                const inviteEmbed = new Discord.MessageEmbed()
                    .setColor('RANDOM')
                    .setTitle('Discord Activities')
                    .setDescription(`[CLICK HERE](https://discord.com/invite/${invite.code}) to start **${activityNames[interaction.options.getString('game')]}**`)
                    .setFooter({text:`Requested By: ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({size: 4096, dynamic: true})})
                return interaction.reply({embeds:[inviteEmbed]});
            });
        } catch (err) {
            return interaction.reply({ephemeral:true, embeds:[errorEmbed]});
        }
    }
}