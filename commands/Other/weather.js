const Discord = require('discord.js');
const weather = require('weather-js');

module.exports = {
    name: "weather",
    category: "Other",
    description: "Check the weather",
    usage: "weather <city>\n**e.g.**\n\`weather Tokyo\`\n> will return weather info about Tokyo",
    run: async (client, msg, arg) => {
        if (client.settings.get(msg.guild.id, "autodeletecmds") === "true") msg.delete();

        const nolocationEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ No location provided`)

        weather.find({
            search: arg.join(" "),
            degreeType: 'C'
          }, function(err, result) {
            //if (err) console.log(err);
            if (result === undefined || result.length === 0) return msg.channel.send(nolocationEmbed).then(msg => {msg.delete({ timeout: 5000 })});
            var current = result[0].current;
            const tempF = [Math.round(current.temperature * 1.8) + 32];
            const feelslikeF = [Math.round(current.feelslike * 1.8) + 32];
            const embed = new Discord.MessageEmbed()
                .setDescription(`**${current.skytext}**`)
                .setAuthor(`Weather for ${current.observationpoint}`)
                .setThumbnail(current.imageUrl)
                .setColor(0x00AE86)
                .addField('Temperature', `${current.temperature} °C | ${tempF} °F`, true)
                .addField('Feels like', `${current.feelslike} °C | ${feelslikeF} °F`, true)
                .addField('Winds', current.winddisplay, true)
                .addField('Humidity', `${current.humidity}%`, true)
            msg.channel.send({embed});
          })
    }
}
