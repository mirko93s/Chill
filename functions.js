const Discord = require("discord.js");

module.exports = {
    getMember: function(msg, toFind = '') {
        toFind = toFind.toLowerCase();

        let target = msg.guild.members.cache.get(toFind);
        
        if (!target && msg.mentions.members)
            target = msg.mentions.members.first();

        if (!target && toFind) {
            target = msg.guild.members.cache.find(member => {
                return member.displayName.toLowerCase().includes(toFind) ||
                member.user.tag.toLowerCase().includes(toFind)
            });
        }
            
        if (!target) 
            target = msg.member;
            
        return target;
    },

    formatDate: function(date) {
        return new Intl.DateTimeFormat('en-US').format(date)
    },

    promptMessage: async function (msg, author, time, validReactions) {
        // We put in the time as seconds, with this it's being transfered to MS
        time *= 1000;

        // For every emoji in the function parameters, react in the good order.
        for (const reaction of validReactions) await msg.react(reaction);

        // Only allow reactions from the author, 
        // and the emoji must be in the array we provided.
        const filter = (reaction, user) => validReactions.includes(reaction.emoji.name) && user.id === author.id;

        // And ofcourse, await the reactions
        return msg
            .awaitReactions(filter, { max: 1, time: time})
            .then(collected => collected.first() && collected.first().emoji.name);
    },

    setupCheck: function(client, msg) {
        let welcomechannel = msg.guild.channels.cache.find(welcomechannel => welcomechannel.name === (client.settings.get(msg.guild.id, "welcomechannel")));
        let bcchannel = msg.guild.channels.cache.find(bcchannel => bcchannel.name === (client.settings.get(msg.guild.id, "bcchannel")));
        let puchannel = msg.guild.channels.cache.find(puchannel => puchannel.name === (client.settings.get(msg.guild.id, "puchannel")));
        let reportchannel = msg.guild.channels.cache.find(reportchannel => reportchannel.name === (client.settings.get(msg.guild.id, "reportchannel")));
        let gachannel = msg.guild.channels.cache.find(gachannel => gachannel.name === (client.settings.get(msg.guild.id, "gachannel")));
        let pollchannel = msg.guild.channels.cache.find(pollchannel => pollchannel.name === (client.settings.get(msg.guild.id, "pollchannel")));
        let musicvocalchannel = msg.guild.channels.cache.find(musicvocalchannel => musicvocalchannel.name === (client.settings.get(msg.guild.id, "musicvocalchannel")));
        let musictextchannel = msg.guild.channels.cache.find(musictextchannel => musictextchannel.name === (client.settings.get(msg.guild.id, "musictextchannel")));
        let ticketcategory = msg.guild.channels.cache.find(ticketcategory => ticketcategory.name === (client.settings.get(msg.guild.id, "ticketcategory")));
        let musictemprole = msg.guild.roles.cache.find(musictemprole => musictemprole.name === (client.settings.get(msg.guild.id, "musictemprole")));
        let mutedrole = msg.guild.roles.cache.find(mutedrole => mutedrole.name === (client.settings.get(msg.guild.id, "mutedrole")));
        let djrole = msg.guild.roles.cache.find(djrole => djrole.name === (client.settings.get(msg.guild.id, "djrole")));
        let supportrole = msg.guild.roles.cache.find(supportrole => supportrole.name === (client.settings.get(msg.guild.id, "supportrole")));
        let roleonjoin = msg.guild.roles.cache.find(roleonjoin => roleonjoin.name === (client.settings.get(msg.guild.id, "roleonjoin")));	
        if(!bcchannel || !puchannel || !reportchannel || !gachannel || !pollchannel|| !mutedrole || !djrole || !welcomechannel || !musicvocalchannel || !musictextchannel || !ticketcategory || !musictemprole || !supportrole || !roleonjoin)
            return false;
        else return true;
    },

    xpAdd: function(client, msg, talkedRecently) {
        let score = client.getScore.get(msg.author.id, msg.guild.id);
		if (!score) {
			score = { id: `${msg.guild.id}-${msg.author.id}`, user: msg.author.id, guild: msg.guild.id, points: 0, level: 0 }
		}
		score.points++;
		const curLevel = Math.floor(0.3163 * Math.sqrt(score.points));
		if(score.level < curLevel) {
			score.level = curLevel;
			const newlevelembed = new Discord.MessageEmbed()
				.setColor(`RANDOM`)
				.setAuthor(msg.author.username, msg.author.avatarURL())
				.setTitle(`Congratulations!`)
				.setDescription(`You leveled up to Lvl **${curLevel}**!`)
			msg.channel.send(newlevelembed);
		}
		client.setScore.run(score);

        talkedRecently.add(msg.author.id); //xp cooldown
        setTimeout(() => {
          talkedRecently.delete(msg.author.id);
        }, client.settings.get(msg.guild.id, "xpcooldown")*1000);
    }
};