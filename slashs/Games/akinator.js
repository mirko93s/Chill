const Discord = require('discord.js');
const { Aki } = require('aki-api');
const isPlaying = new Set()

    module.exports = {
    name: 'akinator',
    description: 'Play Akinator',
    botPerms: ['ADMINISTRATOR'],
    options: [
        {
            name: 'language',
            description: 'Select a language. If omitted it defaults to english',
            type: 'STRING',
            choices: [
                {name:'English', value:'en'},
                {name:'English Objects', value:'en_objects'},
                {name:'English Animals', value:'en_animals'},
                {name:'Arabic', value:'ar'},
                {name:'Chinese', value:'cn'},
                {name:'German', value:'de'},
                {name:'German Animals', value:'de_animals'},
                {name:'Spanish', value:'es'},
                {name:'Spanish Animals', value:'es_animals'},
                {name:'French', value:'fr'},
                {name:'French Objects', value:'fr_objects'},
                {name:'French Animals', value:'fr_animals'},
                {name:'Hebrew', value:'il'},
                {name:'Italian', value:'it'},
                {name:'Italian Animals', value:'it_animals'},
                {name:'Japanese', value:'jp'},
                {name:'Japanese Animals', value:'jp_animals'},
                {name:'Korean', value:'kr'},
                {name:'Dutch', value:'nl'},
                {name:'Polish', value:'pl'},
                {name:'Portuguese', value:'pt'},
                {name:'Russian', value:'ru'},
                {name:'Turkish', value:'tr'},
                {name:'Indonesian', value:'id'},
            ]
        },
    ],
    run: async (client, interaction, arg) => {

        const alreadyPlaying = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setDescription('⛔ You are already playing a game of Akinator!')

        if (isPlaying.has(interaction.member.id)) return interaction.reply({ephemeral:true, embeds:[alreadyPlaying]});
        else isPlaying.add(interaction.member.id);

        interaction.deferReply();

        const b0 = new Discord.MessageButton()
            .setCustomId('0')
            .setLabel('Yes')
            .setStyle('SUCCESS')
            .setEmoji('👍')
        const b3 = new Discord.MessageButton()
            .setCustomId('3')
            .setLabel('Probably')
            .setStyle('PRIMARY')
            .setEmoji('🤔')
        const b2 = new Discord.MessageButton()
            .setCustomId('2')
            .setLabel('I Don\'t Know')
            .setStyle('SECONDARY')
            .setEmoji('❓')
        const b4 = new Discord.MessageButton()
            .setCustomId('4')
            .setLabel('Probably not')
            .setStyle('PRIMARY')
            .setEmoji('🙄')
        const b1 = new Discord.MessageButton()
            .setCustomId('1')
            .setLabel('No')
            .setStyle('DANGER')
            .setEmoji('👎')
        const row = new Discord.MessageActionRow().addComponents(b0, b3, b2, b4, b1);

        const yes = new Discord.MessageButton()
            .setCustomId('yes')
            .setLabel(' ')
            .setStyle('SUCCESS')
            .setEmoji('✅')
        const no = new Discord.MessageButton()
            .setCustomId('no')
            .setLabel(' ')
            .setStyle('DANGER')
            .setEmoji('❌')
        const rowwin = new Discord.MessageActionRow().addComponents(yes, no);

        const region = interaction.options.getString('language') || 'en';
        const childMode = true;
        const proxy = undefined;
        let round = 0;
        var guess = false;

        const aki = new Aki({ region, childMode, proxy });
        await aki.start();

        let gameEmbed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setAuthor({name:'Akinator', iconURL:'https://i.imgur.com/SGdaKmd.png'})
            .setDescription(aki.question)
            .addField(`Questions`, round.toString())
            .setFooter({text:`Progress: ${aki.progress.toFixed(2)}%\n${"▬".repeat((Math.round(aki.progress/5))) + "🔘" + "▬".repeat(20-(Math.round(aki.progress/5)))}`})

        interaction.followUp({embeds:[gameEmbed], components:[row], fetchReply:true}).then(sent => {
            const filter = (i) => {
                i.deferUpdate();
                if (i.user.id === interaction.user.id) return true;
                else return false;
            }
            const collector = sent.createMessageComponentCollector({ filter, componentType: 'BUTTON', time: 60e3 });
            collector.on('collect', async c => {
                collector.resetTimer({ time: 60e3 });
                if (!guess) {
                    await aki.step(c.customId);
                    round++;
                    gameEmbed.setDescription(aki.question).setFooter({text:`Progress: ${aki.progress.toFixed(2)}%\n${"▬".repeat((Math.round(aki.progress/5))) + "🔘" + "▬".repeat(20-(Math.round(aki.progress/5)))}`});
                    gameEmbed.fields[0].value = round.toString();
                    if (aki.progress >= 75 || aki.currentStep >= 78) {
                        guess = !guess;
                        await aki.win();
                        const guessEmbed = new Discord.MessageEmbed()
                            .setColor('RANDOM')
                            .setAuthor({name:'Akinator', iconURL:'https://i.imgur.com/SGdaKmd.png'})
                            .setTitle(aki.answers[0].name)
                            .setDescription(aki.answers[0].description)
                            .setImage(aki.answers[0].absolute_picture_path)
                            .setFooter({text:`Guessed in ${round} rounds`})
                        sent.edit({embeds:[guessEmbed], components:[rowwin]});    
                    } else sent.edit({embeds:[gameEmbed], components:[row]});
                } else if (guess) {
                    if (c.customId === 'yes') {
                        collector.stop();
                    } else {
                        guess = !guess;
                        sent.edit({embeds:[gameEmbed], components:[row]});
                    }
                }
            });
            collector.on('end', (collected, reason) => {
                isPlaying.delete(interaction.member.id);
                if (reason === 'time') gameEmbed.setTitle('Game stopped due to inactivity!');
                sent.edit({components:[]});
            });
        })
    }
}