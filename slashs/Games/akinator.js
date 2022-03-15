const Discord = require('discord.js');
const { Aki } = require('aki-api');
const isPlaying = new Set()

    module.exports = {
    name: 'akinator',
    description: 'Play Akinator',
    botPerms: ['VIEW_CHANNEL','EMBED_LINKS'],
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
        const b1 = new Discord.MessageButton()
            .setCustomId('1')
            .setLabel('No')
            .setStyle('DANGER')
            .setEmoji('👎')
        const b2 = new Discord.MessageButton()
            .setCustomId('2')
            .setLabel('I Don\'t Know')
            .setStyle('SECONDARY')
            .setEmoji('❓')
        const b3 = new Discord.MessageButton()
            .setCustomId('3')
            .setLabel('Probably')
            .setStyle('PRIMARY')
            .setEmoji('🤔')
        const b4 = new Discord.MessageButton()
            .setCustomId('4')
            .setLabel('Probably not')
            .setStyle('PRIMARY')
            .setEmoji('🙄')
        const row = new Discord.MessageActionRow().addComponents(b0, b1, b2, b3, b4);

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
        const wrongGuess = [];
        var sinceLastGuess = false;
        var hasGuessed = false;

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
                    sinceLastGuess++;
                    round++;
                    gameEmbed.setDescription(aki.question).setFooter({text:`Progress: ${aki.progress.toFixed(2)}%\n${"▬".repeat((Math.round(aki.progress/5))) + "🔘" + "▬".repeat(20-(Math.round(aki.progress/5)))}`});
                    gameEmbed.fields[0].value = round.toString();
                    if ((aki.progress >= 80 && (hasGuessed === false || sinceLastGuess >= 5)) || aki.currentStep >= 78) {
                        hasGuessed = true;
                        sinceLastGuess = 0;
                        await aki.win();
                        const guessed = aki.answers.filter(g => !wrongGuess.includes(g.id));
                        if (guessed.length > 0) {
                            guess = true;
                            const guessEmbed = new Discord.MessageEmbed()
                                .setColor('RANDOM')
                                .setAuthor({name:'Akinator', iconURL:'https://i.imgur.com/SGdaKmd.png'})
                                .setTitle(guessed[0].name)
                                .setDescription(guessed[0].description)
                                .setImage(guessed[0].absolute_picture_path)
                                .setFooter({text:`Guessed in ${round} rounds`})
                           await sent.edit({embeds:[guessEmbed], components:[rowwin]});
                        } else await sent.edit({embeds:[gameEmbed], components:[row]});
                    } else await sent.edit({embeds:[gameEmbed], components:[row]});
                } else if (guess) {
                    if (c.customId === 'yes') {
                        collector.stop('win');
                    } else {
                        guess = false;
                        wrongGuess.push(aki.answers.filter(g => !wrongGuess.includes(g.id))[0].id);
                        if (aki.currentStep >= 78) {
                            collector.stop('defeated');
                            const defeatedEmbed = new Discord.MessageEmbed()
                                .setColor('RANDOM')
                                .setAuthor({name:'Akinator', iconURL:'https://i.imgur.com/SGdaKmd.png'})
                                .setTitle('Well played!')
                                .setDescription('You defeated me...')
                            return sent.edit({embeds:[defeatedEmbed], components:[]});
                        } else sent.edit({embeds:[gameEmbed], components:[row]});
                    }
                }
            });
            collector.on('end', (collected, reason) => {
                isPlaying.delete(interaction.member.id);
                if (reason === 'time') gameEmbed.setTitle('Game stopped due to inactivity!');
                else if (reason === 'win') sent.edit({components:[]});
            });
        })
    }
}