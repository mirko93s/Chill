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

    dmOwnerOnJoin: function(client, guild) {
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
    },

    welcomeMessage: function(member, guild) {
        let count = guild.memberCount.toString();
        if (count.endsWith("1") === true) count += "st";
            else if (count.endsWith("2") === true) count += "nd";
                else if (count.endsWith("3") === true) count += "rd";
                    else count += "th";
        var message = [
            `${member.user} has joined.`,
            `${member.user} joined ${guild.name}.`,
            `Welcome, ${member.user}.`,
            `${member.user} is our 1,000,000th visitor. React for a free IPhone.`,
            `Let's all give a warm welcome to ${member.user}.`,
            `Wild ${member.user} appeared!`,
            `👋 ${member.user} 👋`,
            `Welcome ${member.user}, you are the ${count} member.`,
            `Hi ${member.user}, hope you will enjoy staying in our server. `,
            `Hello ${member.user}, we were expecting you.`,
            `●●●${member.user} is typing...`
        ];
        const welcomeEmbed = new Discord.MessageEmbed()
            .setColor('GREEN')
            .setDescription(message[Math.floor(Math.random() * message.length)])
            
        return welcomeEmbed;
    },

    setupGuildOnJoin: async function(client, guild) {
        //roles
        await guild.roles.create({ data: {name: "Listening",permissions: [], color: 'CCCC00'}})
            .then(role => {client.settings.set(guild.id, role.id, "musictemprole")});
        guild.roles.create({ data: {name: "Muted",permissions: [],color: '525252'}})
            .then(role => {client.settings.set(guild.id, role.id, "mutedrole")});
        guild.roles.create({ data: {name: "DJ",permissions: ['CONNECT'], color: 'D00091'}})
            .then(role => {client.settings.set(guild.id, role.id, "djrole")});
        guild.roles.create({ data: {name: "Support",permissions: [], color: 'FC72F3'}})
            .then(role => {client.settings.set(guild.id, role.id, "supportrole")});
        guild.roles.create({ data: {name: "Member",permissions: ['VIEW_CHANNEL'], color: '33FFFF'}})
            .then(role => {client.settings.set(guild.id, role.id, "roleonjoin")});
        //channels
        guild.channels.create("🎫tickets", {type: 'category'})
            .then(channel => {client.settings.set(guild.id, channel.id, "ticketcategory")});
        guild.channels.create("👋welcome", {type: 'text', 
            permissionOverwrites: [{id: guild.roles.everyone.id, 
            deny: ['SEND_MESSAGES',`SEND_TTS_MESSAGES`,`EMBED_LINKS`,`ATTACH_FILES`]}]})
            .then(channel => {client.settings.set(guild.id, channel.id, "welcomechannel")});
        guild.channels.create("🔴broadcast", {type: 'text', 
            permissionOverwrites: [{id: guild.roles.everyone.id, 
            deny: ['SEND_MESSAGES',`SEND_TTS_MESSAGES`,`EMBED_LINKS`,`ATTACH_FILES`]}]})
            .then(channel => {client.settings.set(guild.id, channel.id, "bcchannel")});
        guild.channels.create("🔨punishments", {type: 'text', 
            permissionOverwrites: [{id: guild.roles.everyone.id, 
            deny: ['SEND_MESSAGES',`SEND_TTS_MESSAGES`,`EMBED_LINKS`,`ATTACH_FILES`]}]})
            .then(channel => {client.settings.set(guild.id, channel.id, "puchannel")});
        guild.channels.create("🚨reports", {type: 'text', 
            permissionOverwrites: [{id: guild.roles.everyone.id, 
            deny: [`VIEW_CHANNEL`]}]})
            .then(channel => {client.settings.set(guild.id, channel.id, "reportchannel")});
        guild.channels.create("🎉giveaway", {type: 'text', 
            permissionOverwrites: [{id: guild.roles.everyone.id, 
            deny: ['SEND_MESSAGES',`SEND_TTS_MESSAGES`,`EMBED_LINKS`,`ATTACH_FILES`]}]})
            .then(channel => {client.settings.set(guild.id, channel.id, "gachannel")});
        guild.channels.create("💡poll", {type: 'text', 
            permissionOverwrites: [{id: guild.roles.everyone.id, 
            deny: ['SEND_MESSAGES',`SEND_TTS_MESSAGES`,`EMBED_LINKS`,`ATTACH_FILES`]}]})
            .then(channel => {client.settings.set(guild.id, channel.id, "pollchannel")});
        guild.channels.create("🔊music", {type: 'voice',
            permissionOverwrites: [{id: guild.roles.everyone.id, 
            deny: ['SPEAK']}]})
            .then(channel => {client.settings.set(guild.id, channel.id, "musicvocalchannel")});
        guild.channels.create("🎵song-request", {type: 'text', 
            permissionOverwrites: [
            {id: guild.roles.everyone.id, 
            deny: ['VIEW_CHANNEL']},
            {id: client.settings.get(guild.id, "musictemprole"),
            allow: ['VIEW_CHANNEL','SEND_MESSAGES']}]})
            .then(channel => {client.settings.set(guild.id, channel.id, "musictextchannel")});
    }
};