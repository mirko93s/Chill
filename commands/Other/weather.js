const Discord = require('discord.js');
const weather = require('weather-js');

module.exports = {
    name: "weather",
    category: "Other",
    description: "get weather info",
    usage: "<city>",
    run: async (client, msg, arg) => {
        msg.delete();
        weather.find({
            search: arg.join(" "),
            degreeType: 'C'
          }, function(err, result) {
            //if (err) console.log(err);
            if (result === undefined || result.length === 0) return msg.channel.send("No city provided").then(msg => {msg.delete(5000)});
            var current = result[0].current;
            var location = result[0].location;
            const tempF = [Math.round(current.temperature * 1.8) + 32];
            const embed = new Discord.RichEmbed()
              .setDescription(`**${current.skytext}**`)
              .setAuthor(`Weather for ${current.observationpoint}`)
              .setThumbnail(current.imageUrl)
              .setColor(0x00AE86)
              .addField('Temperature', `${current.temperature} °C | ${tempF} °F`, true)
              .addField('Feels like', `${current.feelslike} Degrees`, true)
              .addField('Winds', current.winddisplay, true)
              .addField('Humidity', `${current.humidity}%`, true)
            msg.channel.send({embed});
          })
    }
}
