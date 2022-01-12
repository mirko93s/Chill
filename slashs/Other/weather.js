const Discord = require('discord.js');
const weather = require('weather-js');

module.exports = {
    name: "weather",
    description: "Check the weather",
    options: [
        {
            name: "city",
            description: "City to get weather of",
            type: 'STRING',
            required: true,
        },
    ],
    run: async (client, interaction, arg) => {

        const nolocationEmbed = new Discord.MessageEmbed()
            .setColor(`RED`)
            .setTitle(`⛔ Location not found`)

        weather.find({
            search: arg.join(" "),
            degreeType: 'C'
          }, function(err, result) {
            if (result === undefined || result.length === 0) return interaction.reply({ephemeral:true, embeds:[nolocationEmbed]});
            var current = result[0].current;
            const tempF = [Math.round(current.temperature * 1.8) + 32];
            const feelslikeF = [Math.round(current.feelslike * 1.8) + 32];
            const embed = new Discord.MessageEmbed()
                .setDescription(`**${current.skytext}**`)
                .setAuthor({name:`Weather for ${current.observationpoint}`})
                .setThumbnail(current.imageUrl)
                .setColor(0x00AE86)
                .addField('Temperature', `${current.temperature} °C | ${tempF} °F`, true)
                .addField('Feels like', `${current.feelslike} °C | ${feelslikeF} °F`, true)
                .addField('Winds', current.winddisplay, true)
                .addField('Humidity', `${current.humidity}%`, true)
            return interaction.reply({embeds:[embed]});
          })
    }
}
