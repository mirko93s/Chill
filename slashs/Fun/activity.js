const Discord = require("discord.js");
const fetch = require('node-fetch');

module.exports = {
    name: "activities",
    description: "Start a Discord Activity. Some of them may not work on your server due to Discord or missing Boost!",
    botPerms: ['CREATE_INSTANT_INVITE'],
    options: [
        {
            name: 'game',
            description: 'Choose an activity. (max players) [server boost tier]',
            type: 'STRING',
            required: true,
            choices:[
                // free
                {name: 'Sketch Heads ( 8 )',value: '902271654783242291'},
                {name: 'Word Snacks ( 8 )',value: '879863976006127627'},
                {name: 'Watch Together ( ∞ )',value: '880218394199220334'},
                {name: 'Betrayal.io ( ∞ )',value: '773336526917861400'},
                {name: 'Fishington.io ( ∞ )',value: '814288819477020702'},
                {name: 'Sketchy Artist ( 12 )',value: '879864070101172255'},
                {name: 'Awkword ( 12 )',value: '879863881349087252'},
                // tier 1
                {name: 'Poker Night ( 8 ) [ 1 ]',value: '755827207812677713'},
                {name: 'Chess In The Park ( ∞ ) [ 1 ]',value: '832012774040141894'},
                {name: 'Checkers In The Park ( ∞ ) [ 1 ]',value: '832013003968348200'},
                {name: 'Blazing 8s ( 8 ) [ 1 ]',value: '832025144389533716'},
                {name: 'Letter League ( 8 ) [ 1 ]',value: '879863686565621790'},
                {name: 'SpellCast ( 6 ) [ 1 ]',value: '852509694341283871'},
                // {name: 'Doodle Crew',value: '878067389634314250'},
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
            // free
            '902271654783242291':'Sketch Heads',
            '879863976006127627':'Word Snacks',
            '880218394199220334':'Watch Together',
            '773336526917861400':'Betrayal.io',
            '814288819477020702':'Fishington.io',
            '879864070101172255':'Sketchy Artist',
            '879863881349087252':'Awkword',
            // tier 1 boost
            '755827207812677713':'Poker Night',
            '832012774040141894':'Chess In The Park',
            '832013003968348200':'Checkers In The Park',
            '832025144389533716':'Blazing 8s',
            '879863686565621790':'Letter League',
            '852509694341283871':'SpellCast',
            // '878067389634314250':'Doodle Crew', // removed at 26/03/22, still works but not on the official discord list
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
