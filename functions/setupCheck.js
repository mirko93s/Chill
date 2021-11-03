/**
 * @param {Client} client 
 * @param {Object} msg 
 * @returns {Boolean}
 */
module.exports = function(client, msg) {
    let welcomechannel = msg.guild.channels.cache.find(welcomechannel => welcomechannel.id === (client.settings.get(msg.guild.id, "welcomechannel")));
    let bcchannel = msg.guild.channels.cache.find(bcchannel => bcchannel.id === (client.settings.get(msg.guild.id, "bcchannel")));
    let puchannel = msg.guild.channels.cache.find(puchannel => puchannel.id === (client.settings.get(msg.guild.id, "puchannel")));
    let reportchannel = msg.guild.channels.cache.find(reportchannel => reportchannel.id === (client.settings.get(msg.guild.id, "reportchannel")));
    let gachannel = msg.guild.channels.cache.find(gachannel => gachannel.id === (client.settings.get(msg.guild.id, "gachannel")));
    let pollchannel = msg.guild.channels.cache.find(pollchannel => pollchannel.id === (client.settings.get(msg.guild.id, "pollchannel")));
    let musicvocalchannel = msg.guild.channels.cache.find(musicvocalchannel => musicvocalchannel.id === (client.settings.get(msg.guild.id, "musicvocalchannel")));
    let musictextchannel = msg.guild.channels.cache.find(musictextchannel => musictextchannel.id === (client.settings.get(msg.guild.id, "musictextchannel")));
    let ticketcategory = msg.guild.channels.cache.find(ticketcategory => ticketcategory.id === (client.settings.get(msg.guild.id, "ticketcategory")));
    let musictemprole = msg.guild.roles.cache.find(musictemprole => musictemprole.id === (client.settings.get(msg.guild.id, "musictemprole")));
    let mutedrole = msg.guild.roles.cache.find(mutedrole => mutedrole.id === (client.settings.get(msg.guild.id, "mutedrole")));
    let djrole = msg.guild.roles.cache.find(djrole => djrole.id === (client.settings.get(msg.guild.id, "djrole")));
    let supportrole = msg.guild.roles.cache.find(supportrole => supportrole.id === (client.settings.get(msg.guild.id, "supportrole")));
    let roleonjoin = msg.guild.roles.cache.find(roleonjoin => roleonjoin.id === (client.settings.get(msg.guild.id, "roleonjoin")));	
    if(!bcchannel || !puchannel || !reportchannel || !gachannel || !pollchannel|| !mutedrole || !djrole || !welcomechannel || !musicvocalchannel || !musictextchannel || !ticketcategory || !musictemprole || !supportrole || !roleonjoin)
        return false;
    else return true;
}