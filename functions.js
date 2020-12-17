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
    },

    dmOwnerOnJoin: async function(client, guild) {
        const dmonweronjoinEmbed = new Discord.MessageEmbed()
            .setColor(`RANDOM`)
            .setAuthor(`Chill - Discord Bot`)
            .setURL(`https://www.mirko93s.it/`)
            .setThumbnail(client.user.avatarURL())
            .setTitle(`Thanks for inviting my bot!`)
            .setDescription(`⚠️ Follow these instructions to setup the Bot (Don't skip them!) ⚠️
            \n1️⃣ Type **.showconfig** \n> You can check the default settings in there. \n> **Then you can set them as you prefer using .setconfig.
            \n2️⃣ Type **.setup** \n> It will create required channels, roles, etc according to the config you just set.
            \n3️⃣ Set your role hierarchy\n> **Chill** (bot) role must be just below the owner/admin role.\n> **Muted** role must be above any other role that your members will get.
            \n4️⃣ Extra settings\n> Sometimes you might need to adjust channel permissions to avoid that "Muted" members can still send messages.
            \n5️⃣ Music\n> Don't forget to give **DJ** role to your members to make sure they can use Music commands.\n> If you will use "Music Only Channel" a hidden text channel will only be shown to people who are connected to the Music Vocal Channel`)
            .setFooter(`©️ 2019-2020 by mirko93s`,`https://cdn.discordapp.com/avatars/278380909588381698/029d0578df3fa298132b3d85dd06bf3c.png?size=128`)
	    guild.owner.send(dmonweronjoinEmbed);
    }
};